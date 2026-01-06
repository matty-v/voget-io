#!/bin/bash
set -e

BUCKET_NAME="voget-io"
DOMAIN="voget.io"
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

# Resource names
BACKEND_BUCKET_NAME="voget-io-backend"
URL_MAP_NAME="voget-io-url-map"
HTTPS_PROXY_NAME="voget-io-https-proxy"
HTTP_PROXY_NAME="voget-io-http-proxy"
SSL_CERT_NAME="voget-io-ssl-cert"
HTTPS_FORWARDING_RULE_NAME="voget-io-https-rule"
HTTP_FORWARDING_RULE_NAME="voget-io-http-rule"
IP_NAME="voget-io-ip"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Setting up HTTPS Load Balancer for ${DOMAIN} ===${NC}"
echo -e "${YELLOW}Project: ${PROJECT_ID}${NC}"
echo -e "${YELLOW}Bucket: ${BUCKET_NAME}${NC}"

# 1. Reserve a static external IP address
echo -e "\n${GREEN}1. Reserving static IP address...${NC}"
if ! gcloud compute addresses describe $IP_NAME --global &>/dev/null; then
    gcloud compute addresses create $IP_NAME \
        --network-tier=PREMIUM \
        --ip-version=IPV4 \
        --global
fi
IP_ADDRESS=$(gcloud compute addresses describe $IP_NAME --global --format="value(address)")
echo -e "${YELLOW}IP Address: ${IP_ADDRESS}${NC}"

# 2. Create a backend bucket
echo -e "\n${GREEN}2. Creating backend bucket...${NC}"
if ! gcloud compute backend-buckets describe $BACKEND_BUCKET_NAME &>/dev/null; then
    gcloud compute backend-buckets create $BACKEND_BUCKET_NAME \
        --gcs-bucket-name=$BUCKET_NAME \
        --enable-cdn \
        --cache-mode=CACHE_ALL_STATIC
fi

# 3. Create a URL map
echo -e "\n${GREEN}3. Creating URL map...${NC}"
if ! gcloud compute url-maps describe $URL_MAP_NAME &>/dev/null; then
    gcloud compute url-maps create $URL_MAP_NAME \
        --default-backend-bucket=$BACKEND_BUCKET_NAME
fi

# 4. Create a managed SSL certificate
echo -e "\n${GREEN}4. Creating managed SSL certificate...${NC}"
if ! gcloud compute ssl-certificates describe $SSL_CERT_NAME &>/dev/null; then
    gcloud compute ssl-certificates create $SSL_CERT_NAME \
        --domains=$DOMAIN \
        --global
fi

# 5. Create the HTTPS target proxy
echo -e "\n${GREEN}5. Creating HTTPS target proxy...${NC}"
if ! gcloud compute target-https-proxies describe $HTTPS_PROXY_NAME &>/dev/null; then
    gcloud compute target-https-proxies create $HTTPS_PROXY_NAME \
        --ssl-certificates=$SSL_CERT_NAME \
        --url-map=$URL_MAP_NAME \
        --global
fi

# 6. Create the HTTPS forwarding rule
echo -e "\n${GREEN}6. Creating HTTPS forwarding rule (port 443)...${NC}"
if ! gcloud compute forwarding-rules describe $HTTPS_FORWARDING_RULE_NAME --global &>/dev/null; then
    gcloud compute forwarding-rules create $HTTPS_FORWARDING_RULE_NAME \
        --load-balancing-scheme=EXTERNAL_MANAGED \
        --network-tier=PREMIUM \
        --address=$IP_NAME \
        --target-https-proxy=$HTTPS_PROXY_NAME \
        --global \
        --ports=443
fi

# 7. Create HTTP target proxy (needed for SSL cert validation)
echo -e "\n${GREEN}7. Creating HTTP target proxy...${NC}"
if ! gcloud compute target-http-proxies describe $HTTP_PROXY_NAME &>/dev/null; then
    gcloud compute target-http-proxies create $HTTP_PROXY_NAME \
        --url-map=$URL_MAP_NAME \
        --global
fi

# 8. Create HTTP forwarding rule (port 80 - required for SSL cert provisioning)
echo -e "\n${GREEN}8. Creating HTTP forwarding rule (port 80)...${NC}"
if ! gcloud compute forwarding-rules describe $HTTP_FORWARDING_RULE_NAME --global &>/dev/null; then
    gcloud compute forwarding-rules create $HTTP_FORWARDING_RULE_NAME \
        --load-balancing-scheme=EXTERNAL_MANAGED \
        --network-tier=PREMIUM \
        --address=$IP_NAME \
        --target-http-proxy=$HTTP_PROXY_NAME \
        --global \
        --ports=80
fi

# Print DNS instructions
echo -e "\n${GREEN}=== Setup Complete ===${NC}"
echo -e "\n${YELLOW}IMPORTANT: Add this DNS record to your domain:${NC}"
echo -e "  Type: A"
echo -e "  Name: @ (or leave empty for apex domain)"
echo -e "  Value: ${IP_ADDRESS}"
echo -e "\n${YELLOW}SSL certificate status:${NC}"
gcloud compute ssl-certificates describe $SSL_CERT_NAME --global --format="value(managed.status)"
echo -e "\nNote: SSL certificate provisioning can take 15-60 minutes after DNS is configured."
echo -e "Check status with: gcloud compute ssl-certificates describe $SSL_CERT_NAME --global"
echo -e "\nOnce complete, your app will be available at: https://${DOMAIN}/"
