// Cadastrar novos usuarios | Recuperar usuarios no localStorage
let fazerCadastro = document.querySelector(".fazer-cadastro")
fazerCadastro.addEventListener("click", () => {
    let usuario = document.getElementById("usuario").value
    let senha = document.getElementById("senha").value

    if(!usuario || !senha){
        alert("Usuário/Senha incorretos.")
        return
    }

    document.querySelector(".fechar-popup").addEventListener("click", () => {
        document.querySelector(".box-popup").classList.remove("box-popup-active")
    })


    // Recuperar a lista de usuários existentes ou criar uma nova
    const usuariosJSON = localStorage.getItem("usuarios")
    let usuarios = usuariosJSON ? JSON.parse(usuariosJSON) : []

    // Verificar se o usuário(cadastrado) já existe
    const usuarioExistente = usuarios.find(user => user.usuario === usuario)
    if(usuarioExistente) {
        document.querySelector(".box-popup").classList.add("box-popup-active")
        return
    } 

    // Adicionar o novo usuário
    usuarios.push({ usuario, senha })

    // Salvar no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios))

    alert("Usuário Cadastrado com sucesso.")

    // Limpar campos do input
    document.getElementById("usuario").value = ""
    document.getElementById("senha").value = ""
})