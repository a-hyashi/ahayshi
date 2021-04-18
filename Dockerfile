FROM centos:centos7
RUN rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
WORKDIR /buddy-theme
RUN yum -y update && yum -y install epel-release wget make
RUN yum install -y https://rpm.nodesource.com/pub_15.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm
RUN yum install nodejs -y
RUN npm install -g npm@7.9.0
RUN npm install -g gulp@4.0.2
RUN yum clean all
RUN yum install -y automake autoconf libtool git make gcc* zlib1g-dev