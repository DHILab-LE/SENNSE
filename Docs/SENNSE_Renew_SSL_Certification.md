# 🔐 Fixing SSL Certificate Expiration for SENNSE (Certbot + Nginx)

If you encounter an error such as **"certificate expired"**, you can manually check and renew the certificates using **Certbot** with the Nginx plugin.  

This guide explains how to:  
- 📥 Obtain new certificates  
- 🔄 Enable auto-renewal  
- 🧪 Test the renewal process  
- ⚡ Auto-reload Nginx after renewal  

---

## 📋 Prerequisites

✅ Your server is running **Nginx**  
✅ You have **sudo access**  
✅ Domains are properly pointed to your server  
✅ Certbot is installed (`sudo apt install certbot python3-certbot-nginx`)  

---

## 1️⃣ Obtain or Renew Certificates

Run Certbot with the Nginx plugin for your domains:

```bash
sudo certbot --nginx -d sennse.ispc.cnr.it -d 3d.sennse.ispc.cnr.it
```
✨ What happens automatically:
- Certbot obtains certificates for both domains
- Updates your **Nginx config** automatically
- Sets up an **HTTP-01 challenge** via Nginx (no need to stop containers)
- Creates a renewal config under:
```swift
/etc/letsencrypt/renewal/
```
## 2️⃣ Ensure Automatic Renewal is Enabled
Certbot usually sets up a cron job or systemd timer to run:

```bash
sudo certbot renew
```
⚠️ If you encounter a port 80 error, temporarily stop Nginx:
```bash
sudo systemctl stop nginx
```
After the renewal finishes, restart Nginx:
```bash
sudo systemctl start nginx
```
## 3️⃣ Test Renewal Process
You can test without waiting for expiration:
```bash
sudo certbot renew --dry-run
```
✅ If you see:
```css
Congratulations, all renewals succeeded
```
… you’re good to go!
## 4️⃣ Auto-Reload Nginx After Renewal
By default, even after renewal, Nginx won’t use the new cert until it reloads.

Add a **post-hook** so Certbot reloads Nginx automatically:
```bash
sudo bash -c 'echo "post_hook = systemctl reload nginx" >> /etc/letsencrypt/cli.ini'
```
Now, whenever a certificate is renewed, Nginx reloads and uses the fresh cert immediately. 🎉

## 📝 Summary
1. Use `certbot --nginx` to request/renew certificates
2. Ensure automatic renewal (`certbot renew`)  
3. Test renewal with `--dry-run`
4. Add a post-hook so Nginx reloads automatically

💡 With this setup, your SENNSE platform will always serve valid SSL certificates without downtime.