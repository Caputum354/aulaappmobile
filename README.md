# 🎮 GameStore App – React Native

Aplicativo mobile feito em **React Native** com **react-native-paper**, simulando um sistema de gerenciamento e venda de jogos com operações completas de CRUD.

## 📱 Funcionalidades

* Listagem de jogos
* Busca por nome, plataforma ou gênero
* Cadastro de novos jogos
* Edição de jogos existentes
* Exclusão com confirmação
* Controle de disponibilidade
* Exibição de imagem via URL
* Feedback visual com Snackbar

## 🧠 Como funciona

O projeto utiliza:

* **Mock database** para simular um banco de dados local
* **API simulada** com `Promise` e `setTimeout` para imitar requisições assíncronas
* **useState** para controle de estados
* **useEffect** para carregar os dados ao iniciar o app
* **FlatList** para renderização eficiente da lista

O sistema permite cadastrar, editar e excluir jogos, além de filtrar dinamicamente conforme o usuário digita na busca.

## 🎨 Interface

A interface foi construída com componentes do **react-native-paper**, utilizando:

* Cards para exibir os jogos
* Modal para cadastro/edição
* Modal de confirmação para exclusão
* Badge para indicar disponibilidade
* Botão flutuante para adicionar novos jogos

## 🚀 Tecnologias

* React Native
* React Hooks
* react-native-paper
* JavaScript ES6+

## ▶️ Como executar

```bash
npm install
npx expo start
```

Ou:

```bash
npx react-native run-android
```

## 📌 Objetivo do projeto

Demonstrar domínio de:

* Manipulação de estado
* Estruturação de CRUD
* Simulação de API
* Organização de interface mobile
