RF => Requisitos Funcionais RNF => Requisitos não Funcionais RN => Regra de Negócio

# Cadastro de carro
**RF** 
Deve ser possível cadastrar um novo carro.

**RN** 
Não deve ser possível cadastar um novo carro com placa já existente. 
O carro deve ser cadastrado com disponibilidade, por padrão. 
O usuário responsável pelo cadastro deve ser um usuário administrador.

# Listagem de carros
**RF** 
Deve ser possível listar todos os carros disponíveis. 
Deve ser possível listar todos os carros disponíveis pelo nome da categoria. 
Deve ser possível listar todos os carros disponíveis pelo nome da marca. 
Deve ser possível listar todos os carros disponíveis pelo nome do carro.

**RN** 
O usuário não precisa estar logado no sistema para realizar a listagem.

# Cadastro de Especificações no Carro
**RF** 
Deve ser possível cadastrar uma especificação para um carro.


**RN** 
Não deve ser possível cadastrar uma especificação para um carro não cadastrado. 
Não deve ser possível cadastrar uma especificação já existente para o mesmo carro. 
Apenas um usuário administrador tem permissão para realizar cadastro.

# Cadastro de Imagens do Carro
**RF** 
Deve ser possível cadastrar a imagem do carro.
Deve ser possível listar todos os carros

**RNF** 
Utilizar o multer para o upload dos arquivos.

**RN** 
O usuário deve poder cadastrar mais de uma imagem para o mesmo carro. 
Apenas um usuário administrador tem permissão para realizar cadastro.

# Aluguel
**RF** 
Deve ser possível cadastrar um aluguel.

**RN** 
O aluguel deve ter duração mínima de 24 horas. 
Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário. 
Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro. 
O usuário deve estar logado na aplicação.
