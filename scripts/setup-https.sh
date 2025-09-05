#!/bin/bash

# Setup HTTPS for DefendSphere
# This script generates self-signed certificates for development
# For production, use proper certificates from a CA

echo "🔐 Setting up HTTPS for DefendSphere..."

# Create certificates directory
mkdir -p certs

# Generate private key
echo "📝 Generating private key..."
openssl genrsa -out certs/private-key.pem 2048

# Generate certificate signing request
echo "📝 Generating certificate signing request..."
openssl req -new -key certs/private-key.pem -out certs/certificate.csr -subj "/C=US/ST=State/L=City/O=DefendSphere/CN=localhost"

# Generate self-signed certificate
echo "📝 Generating self-signed certificate..."
openssl x509 -req -days 365 -in certs/certificate.csr -signkey certs/private-key.pem -out certs/certificate.pem

# Clean up CSR file
rm certs/certificate.csr

echo "✅ HTTPS certificates generated successfully!"
echo "📁 Certificates location: ./certs/"
echo "   - Private key: certs/private-key.pem"
echo "   - Certificate: certs/certificate.pem"
echo ""
echo "⚠️  Note: These are self-signed certificates for development only."
echo "   For production, use certificates from a trusted Certificate Authority."
echo ""
echo "🚀 To use HTTPS, set the following environment variables:"
echo "   export HTTPS=true"
echo "   export SSL_KEY_PATH=./certs/private-key.pem"
echo "   export SSL_CERT_PATH=./certs/certificate.pem"