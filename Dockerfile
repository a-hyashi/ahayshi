FROM centos:centos7
RUN rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
WORKDIR /buddy-theme
RUN rpm -i --nosignature https://rpm.nodesource.com/pub_12.x/el/7/x86_64/nodejs-12.18.3-1nodesource.x86_64.rpm
RUN npm install -g npm
RUN npm install -g gulp@4.0.2
RUN yum clean all
RUN yum install -y git make gcc*
