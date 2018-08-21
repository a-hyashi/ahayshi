FROM centos:centos7

WORKDIR /buddy-theme

RUN rpm -i https://rpm.nodesource.com/pub_9.x/el/7/x86_64/nodejs-9.8.0-1nodesource.x86_64.rpm
RUN node -v
RUN npm install -g npm@5.7.1
RUN npm -v
RUN npm install -g gulp