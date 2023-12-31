# dockerfile para rodar testes de maneira consistente e repetida
# Pinar a versão específica do node que é necessário para rodar testes
FROM node:18.14

WORKDIR /usr/app

ENV NODE_ENV=development

# Transferir apenas arquivos de dependências primeiro(cache por layer)
COPY package*.json ./

RUN npm i 

COPY . .

CMD [ "npm", "test" ]