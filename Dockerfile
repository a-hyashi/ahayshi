FROM centos:centos7

WORKDIR /buddy-theme

RUN rpm -i https://rpm.nodesource.com/pub_11.x/el/7/x86_64/nodejs-11.10.1-1nodesource.x86_64.rpm
RUN npm install -g npm@6.9.0
RUN npm install -g gulp@3.9.1
RUN yum clean all
RUN yum install -y git make gcc*
