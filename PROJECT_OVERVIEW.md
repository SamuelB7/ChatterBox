Overview

A empresa ChatterBox possui um sistema de conversas em que seus clientes utilizam desta plataforma para atender seus clientes. O ChatterBox App foi desenhado já faz algum tempo e na época foi decidido seguir com um monolito integrado a um chatbot pronto de mercado ao invés de adicionar complexidade e desenhar a aplicação de forma distribuída e IA não era uma realidade. Você foi contratado para começar o ChatterBox 2.0 com IA e reescrever o sistema. Para a primeira fase o arquiteto da empresa solicitou que você faça uma prova de conceito da seguinte forma:

1) ChatterBox (API)
•⁠  ⁠Uma Rest API para manter as conversas
•⁠  ⁠Stack mínima definida pelo Arquiteto é Python ou NodeJS, e MongoDB

2) ChatterBox (Web)
•⁠  ⁠Web para visualização das conversas
•⁠  ⁠Stack mínima definida pelo Arquiteto é ReactJS

Você como um desenvolvedor sabe que para que possa entregar essa prova de conceito para o Arquiteto em tempo hábil deverá então utilizar Docker para subir uma infra local. Arquiteto gostaria de ver nessa prova de conceito:

Requisitos mínimos
a) Quando usuário acessar ele consegue iniciar uma conversa
b) As mensagens são separadas por quem enviou, neste caso seria entre um o usuário e o IA
c) O sistema deverá armazenar e processar as mensagens da conversa utilizando a IA para responder ao usuário
d) A IA terá um objetivo para essa prova de conceito, que será "Convencer o usuário que a terra é plana."

Requisitos (opcionais)
e) As mensagens ao ser enviadas pelo IA mostram de forma ao vivo para o usuário (utilizando websocket)

Detalhes do Desafio
•⁠  ⁠O objetivo não é ter um sistema completo mas sim uma prova de conceito para demonstrar os requisitos mínimos
•⁠  ⁠Nao precisa de autenticação
•⁠  ⁠Lembre-se que isso é uma prova de conceito, cuidado para não complicar esta solução