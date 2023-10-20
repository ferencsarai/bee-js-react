FROM node:18

RUN npm install --global @ethersphere/swarm-cli

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get install -y alien && \
    rm -rf /var/lib/apt/lists/*
RUN curl -o /tmp/bee.rpm -L "https://github.com/ethersphere/bee/releases/download/v1.17.4/bee-1.17.4.aarch64.rpm"
RUN cd /tmp && alien -d bee.rpm && \
    dpkg -i /tmp/bee_1.17.4-2_arm64.deb && \
    rm /tmp/bee.rpm && \
    rm /tmp/bee_1.17.4-2_arm64.deb
#RUN cd bee-dev


#EXPOSE 1633 1635 3000
