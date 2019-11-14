FROM centos:centos7

WORKDIR /buddy-theme

RUN rpm -i https://rpm.nodesource.com/pub_12.x/el/7/x86_64/nodejs-12.9.1-1nodesource.x86_64.rpm
RUN node -v
RUN npm install -g npm@6.9.0
RUN npm -v
RUN npm install -g gulp@4.0.2
RUN yum install -y git make gcc*
