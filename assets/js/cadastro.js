// Cadastrar novos usuarios | Recuperar usuarios no localStorage
let fazerCadastro = document.querySelector(".fazer-cadastro")
fazerCadastro.addEventListener("click", () => {
    let usuario = document.getElementById("usuario").value
    let senha = document.getElementById("senha").value

    // Remover popup quando clicar no button "OK" (Preencher input usuario / senha)
    document.querySelector(".fechar-popup-2").addEventListener("click", () => {
        document.querySelector(".box-popup-2").classList.remove("box-popup-active-2")
    })

    // Verificar se os inputs usuário e senha foram digitados
    if(!usuario || !senha){
        document.querySelector(".box-popup-2").classList.add("box-popup-active-2")
        return
    }

    // Remover popup quando clicar no button "OK" (Usuário já cadastrado)
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

    // Popup "usuario cadastrado com sucesso"
    document.querySelector(".box-popup-3").classList.add("box-popup-active-3")

    // Remover popup quando clicar no button "OK" (Usuario cadastrado com sucesso)
    document.querySelector(".fechar-popup-3").addEventListener("click", () => {
        document.querySelector(".box-popup-3").classList.remove("box-popup-active-3")
    })

    // Limpar campos do input
    document.getElementById("usuario").value = ""
    document.getElementById("senha").value = ""
})