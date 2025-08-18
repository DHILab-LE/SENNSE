# 🚀 SENNSE Platform Backup & Restore Guide (VM ➜ VM)

This guide provides clear, step-by-step instructions to **backup** your entire SENNSE platform from a source virtual machine (**Source Server**) and **restore** it to a target virtual machine (**Target Server**).  
The process ensures **all data and configurations** are migrated successfully using Docker volumes.

---

## 📋 Prerequisites

- ✅ **Target server** with at least **50GB free storage**
- ✅ **SSH access** to both servers
- ✅ **Docker** and **Docker Compose** installed on the target server
- ✅ Basic familiarity with Linux commands

---

## 1️⃣ Install Docker & Docker Compose on the Target Server

Run on the **Target Server**:
```bash
# Update packages
sudo apt update

# Install Docker
sudo apt install docker.io

# Install Docker Compose
sudo apt install docker-compose

# Enable & start Docker
sudo systemctl enable docker
sudo systemctl start docker
```

---

## 2️⃣ Export the Volume from the Source Server

1. **Stop containers** to prevent data corruption:
```bash
docker-compose down
```

2. **Create a compressed backup** of the `mytb-data` volume:
```bash
docker run --rm   -v mytb-data:/from   -v $(pwd):/to   alpine ash -c "cd /from && tar czf /to/mytb-data.tar.gz ."
```

You should now have:
```
mytb-data.tar.gz
```

---

## 3️⃣ Transfer the Backup to the Target Server

Using `scp`:
```bash
scp mytb-data.tar.gz user@new-server:/path/to/destination
```

---

## 4️⃣ Import the Volume on the Target Server

1. **Remove existing volume** (ignore warnings if it doesn’t exist):
```bash
docker volume rm mytb-data
```

2. **Create a new volume**:
```bash
docker volume create mytb-data
```

3. **Restore the backup**:
```bash
docker run --rm   -v mytb-data:/to   -v $(pwd):/from   alpine ash -c "cd /to && tar xzf /from/mytb-data.tar.gz"
```

---

## 5️⃣ Create the docker-compose.yml File

1. **Create a project directory**:
```bash
mkdir DockerCompose_SENNSE_Server
cd DockerCompose_SENNSE_Server
nano docker-compose.yml
```

2. **Paste the configuration**:
```yaml
version: "3.3"
services:
  kafka:
    restart: always
    image: bitnami/kafka:3.5.2
    ports:
      - 9092:9092
      - 9093
      - 9094
    environment:
      ALLOW_PLAINTEXT_LISTENER: "yes"
      KAFKA_CFG_LISTENERS: "OUTSIDE://:9092,CONTROLLER://:9093,INSIDE://:9094"
      KAFKA_CFG_ADVERTISED_LISTENERS: "OUTSIDE://localhost:9092,INSIDE://kafka:9094"
      KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP: "INSIDE:PLAINTEXT,OUTSIDE:PLAINTEXT,CONTROLLER:PLAINTEXT"
      KAFKA_CFG_INTER_BROKER_LISTENER_NAME: "INSIDE"
      KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE: "false"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_CFG_PROCESS_ROLES: "controller,broker"
      KAFKA_CFG_NODE_ID: "0"
      KAFKA_CFG_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_CFG_CONTROLLER_QUORUM_VOTERS: "0@kafka:9093"
    volumes:
      - kafka-data:/bitnami

  mytb:
    restart: always
    image: "meddali/sennse:2.1.5"
    depends_on:
      - kafka
    ports:
      - "8443:9090" # HTTP
      - "1884:1883"
      - "7071:7070"
      - "5690:5688/udp"
      - "5433:5432" # PostgreSQL
    environment:
      TB_QUEUE_TYPE: kafka
      TB_KAFKA_SERVERS: kafka:9094
      SSL_CREDENTIALS_TYPE: "PEM"
      SSL_PEM_CERT: "/config/server_cert.pem"
      SSL_PEM_KEY: "/config/server_key.pem"
    volumes:
      - mytb-data:/data
      - mytb-logs:/var/log/thingsboard
      - /etc/letsencrypt/live/sennse.ispc.cnr.it/fullchain.pem:/config/server_cert.pem:ro
      - /etc/letsencrypt/live/sennse.ispc.cnr.it/privkey.pem:/config/server_key.pem:ro
volumes:
  mytb-data:
    external: true
  mytb-logs:
    external: true
  kafka-data:
    driver: local
```

---

## 6️⃣ Start SENNSE on the New Server

Run:
```bash
sudo docker-compose up -d
```

✅ Your SENNSE platform is now restored and running.

---

## 📝 Summary of Steps
1. Install Docker & Docker Compose on the target VM  
2. Export the `mytb-data` volume from the source VM  
3. Transfer the backup file to the target VM  
4. Import the volume on the target VM  
5. Deploy using the same `docker-compose.yml`  
6. Start services and verify
