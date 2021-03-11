FROM centos:centos7
RUN rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
WORKDIR /buddy-theme
RUN rpm -i --nosignature https://rpm.nodesource.com/pub_15.x/el/7/x86_64/nodejs-15.7.0-1nodesource.x86_64.rpm
RUN npm install -g npm@7
RUN npm install -g gulp@4.0.2
RUN yum clean all
RUN yum install -y automake autoconf libtool git make gcc*
