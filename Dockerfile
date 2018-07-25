FROM node:6.14.3

WORKDIR /buddy-theme

RUN npm install gulp -g

CMD pwd

CMD ls -al

WORKDIR /buddy-theme/031

CMD pwd

CMD ls -al
