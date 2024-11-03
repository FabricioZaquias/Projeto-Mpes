import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [companies, setCompanies] = useState([]); // Novo estado para armazenar as empresas
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ name: '', description: '', image: '', price: '' });
    const [editingProject, setEditingProject] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [registerForm, setRegisterForm] = useState({
        imagem: '',
        nome: '',
        username: '',
        password: '',
        cnpj: '',
        inscricaoEstadual: '',
        tipoEmpresa: '',
        dataAbertura: '',
        naturezaJuridica: '',
        atividadePrincipal: '',
        endereco: '',
        telefone: '',
        email: '',
        socioNome: '',
        socioCpf: '',
        socioDataNascimento: '',
        socioCargo: '',
        socioTelefone: '',
        socioEmail: ''
    });
    const [view, setView] = useState('viewCompanies');

    const handleRegister = (e) => {
        e.preventDefault();
        const { username } = registerForm;
        const existingUser = JSON.parse(localStorage.getItem(username));
    
        if (existingUser) {
            alert('Usuário já existe');
        } else {
            localStorage.setItem(username, JSON.stringify(registerForm));
            setSuccessMessage('Usuário registrado com sucesso!');
            setIsRegistering(false);
            setView('login'); // Redireciona para a página de login
        }
    };
    
    

    const handleLogin = (e) => {
        e.preventDefault();
        const { username, password } = loginForm;
        const storedUser = JSON.parse(localStorage.getItem(username));
        if (storedUser && storedUser.password === password) {
            setIsAuthenticated(true);
            setView('viewProducts');
        } else {
            alert('Credenciais inválidas');
        }
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prevState => ({ ...prevState, [name]: value }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm(prevState => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        if (isAuthenticated) {
            axios.get('http://localhost:5000/projects')
                .then(response => setProjects(response.data))
                .catch(error => console.error('Erro ao buscar projetos:', error));
        }
    }, [isAuthenticated]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
/*************  ✨ Codeium Command ⭐  *************/
    /**
     * Atualiza o projeto com o id `editingProject` no servidor com as
     * informações em `newProject` e atualiza o estado com o novo valor
     * do projeto.
     */
/******  190e992a-2f18-450c-b6cb-0c051881b391  *******/        setNewProject(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddProject = () => {
        axios.post('http://localhost:5000/projects', newProject)
            .then(response => {
                setProjects([...projects, { ...newProject, _id: response.data }]);
                setNewProject({ name: '', description: '', image: '', price: '' });
                setView('viewProducts'); // Voltar para a lista após adicionar
            })
            .catch(error => console.error('Erro ao adicionar projeto:', error));
    };

    const handleDeleteProject = (projectId) => {
        axios.delete(`http://localhost:5000/projects/${projectId}`)
            .then(response => {
                setProjects(projects.filter(project => project._id !== projectId));
            })
            .catch(error => console.error('Erro ao deletar projeto:', error));
    };

    const handleEditProject = (project) => {
        setEditingProject(project._id);
        setNewProject({ name: project.name, description: project.description, image: project.image, price: project.price });
        setView('addProduct'); // Alterna para o formulário de adição/edição
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRegisterForm(prevState => ({
                    ...prevState,
                    imagem: reader.result // Armazena a string base64
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    
    const handleUpdateProject = () => {
        axios.put(`http://localhost:5000/projects/${editingProject}`, newProject)
            .then(response => {
                setProjects(projects.map(project => (
                    project._id === editingProject ? { ...project, ...newProject } : project
                )));
                setEditingProject(null);
                setNewProject({ name: '', description: '', image: '', price: '' });
                setView('viewProducts'); // Voltar para a lista após editar
            })
            .catch(error => console.error('Erro ao atualizar projeto:', error));
    };

    useEffect(() => {
        const storedCompanies = Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)));
        setCompanies(storedCompanies);
    }, []);
return (
    <div>
    <nav className="navbar">
        <ul className="navbar-list">
            <li className="navbar-item" onClick={() => setView('viewCompanies')}>Home</li>
            <li className="navbar-item" onClick={() => setView('contacts')}>Contatos</li>
            <li className="navbar-item" onClick={() => setView('login')}>Login</li>
        </ul>
    </nav>

    <div className="banner">
        <img src="https://github.com/andreza02111/Imagens--trabalho/blob/Python/imagem2.png?raw=true" alt="Banner" />
    </div>

    {!isAuthenticated && view === 'viewCompanies' && (
        <div>
            <h2 className='tituloEmpresas'>Lista de Empresas Registradas</h2>
            <ul className="company-list">
                {companies.map(company => (
                    <li key={company.username} className="company-item">
                        <img src={company.imagem} alt={company.nome} className="company-image" />
                        <div className="company-details">
                            <h3>{company.username}</h3>
                            <h4>{company.nome}</h4>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )}

        {!isAuthenticated && view === 'login' && (
            <div className="login-container">
                <h2>Login</h2>
                {successMessage && <p>{successMessage}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        className="input_login"
                        type="text"
                        name="username"
                        value={loginForm.username}
                        onChange={handleLoginChange}
                        placeholder="Usuário"
                        required
                    />
                    <br />
                    <input
                        className="input_login"
                        type="password"
                        name="password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        placeholder="Senha"
                        required
                    />
                    <br />
                    <button type="submit">Login</button>
                    <button type="button" onClick={() => setView('cadastro')}>Cadastre-se</button>
                    <button type="button" onClick={() => setView('viewCompanies')}>Voltar</button>
                </form>
            </div>
        )}

        {!isAuthenticated && view === 'cadastro' && (
            <div className="cadastro-container">
                <h2>Cadastro Empresa</h2>
                <form onSubmit={handleRegister}>
                    <input
                        className="input_cadastro"
                        type="file"
                        name="imagem"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="nome"
                        value={registerForm.nome}
                        onChange={handleRegisterChange}
                        placeholder="Nome Empresa"
                        required
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="username"
                        value={registerForm.username}
                        onChange={handleRegisterChange}
                        placeholder="Usuário"
                        required
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="password"
                        name="password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        placeholder="Senha"
                        required
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="cnpj"
                        value={registerForm.cnpj}
                        onChange={handleRegisterChange}
                        placeholder="CNPJ"
                        required
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="inscricaoEstadual"
                        value={registerForm.inscricaoEstadual}
                        onChange={handleRegisterChange}
                        placeholder="Inscrição Estadual"
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="tipoEmpresa"
                        value={registerForm.tipoEmpresa}
                        onChange={handleRegisterChange}
                        placeholder="Tipo de Empresa"
                    />
                    <br />
                    <label htmlFor="dataAbertura">Data de abertura:</label>
                    <input
                        className="input_cadastro"
                      
                        type="date"
                        name="dataAbertura"
                        value={registerForm.dataAbertura}
                        onChange={handleRegisterChange}
                        placeholder="Data de Abertura"
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="naturezaJuridica"
                        value={registerForm.naturezaJuridica}
                        onChange={handleRegisterChange}
                        placeholder="Natureza Jurídica"
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="atividadePrincipal"
                        value={registerForm.atividadePrincipal}
                        onChange={handleRegisterChange}
                        placeholder="Atividade Principal"
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="endereco"
                        value={registerForm.endereco}
                        onChange={handleRegisterChange}
                        placeholder="Endereço"
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="telefone"
                        value={registerForm.telefone}
                        onChange={handleRegisterChange}
                        placeholder="Telefone"
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="email"
                        name="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        placeholder="E-mail"
                        required
                    />
                    <br />
                    <h3>Sócio Proprietário</h3>
                    <input
                        className="input_cadastro"
                        type="text"
                        name="socioNome"
                        value={registerForm.socioNome}
                        onChange={handleRegisterChange}
                        placeholder="Nome do Sócio"
                        required
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="socioCpf"
                        value={registerForm.socioCpf}
                        onChange={handleRegisterChange}
                        placeholder="CPF do Sócio"
                        required
                    />
                    <br />
                    <label htmlFor="socioDataNascimento">Data de Nascimento:</label>
                    <input
                        className="input_cadastro"
                        type="date"
                        name="socioDataNascimento"
                        value={registerForm.socioDataNascimento}
                        onChange={handleRegisterChange}
                        placeholder="Data de Nascimento do Sócio"
                        required
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="socioCargo"
                        value={registerForm.socioCargo}
                        onChange={handleRegisterChange}
                        placeholder="Cargo do Sócio"
                        required
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="text"
                        name="socioTelefone"
                        value={registerForm.socioTelefone}
                        onChange={handleRegisterChange}
                        placeholder="Telefone do Sócio"
                        required
                    />
                    <br />
                    <input
                        className="input_cadastro"
                        type="email"
                        name="socioEmail"
                        value={registerForm.socioEmail}
                        onChange={handleRegisterChange}
                        placeholder="E-mail do Sócio"
                        required
                    />
                    <br />
                    <button type="submit">Registrar</button>
                    <button type="button" onClick={() => setView('login')}>Voltar</button>
                </form>
            </div>
        )}

{view === 'viewProducts' && (
                <section id="projectList">
                    <button onClick={() => setView('addProduct')}>Adicionar Produtos</button>
                    <h2>Lista de Produtos</h2>
                    {projects.length === 0 ? (
                        <p>Nenhum produto foi adicionado ainda.</p>
                    ) : (
                        <div className="product-list">
                            {projects.map((project, index) => (
                                <div className="product-item" key={index}>
                                    <strong>{index + 1}. Nome:</strong> {project.name} <br />
                                    <strong>Descrição:</strong> {project.description} <br />
                                    <strong>Imagem:</strong> <img src={project.image} alt={project.name} width="100" /> <br />
                                    <strong>Preço:</strong> {project.price} <br />
                                    <button onClick={() => handleEditProject(project)}>Editar</button>
                                    <button onClick={() => handleDeleteProject(project._id)}>Deletar</button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {view === 'addProduct' && (
                <section id="addProject">
                    <h2>{editingProject ? 'Editar Produto' : 'Adicionar Produto'}</h2>
                    <form onSubmit={(e) => { e.preventDefault(); editingProject ? handleUpdateProject() : handleAddProject(); }}>
                        <input
                            type="text"
                            name="name"
                            value={newProject.name}
                            onChange={handleInputChange}
                            placeholder="Nome do Produto"
                            required
                        />
                        <br />
                        <input
                            type="text"
                            name="description"
                            value={newProject.description}
                            onChange={handleInputChange}
                            placeholder="Descrição"
                            required
                        />
                        <br />
                        <input
                            type="text"
                            name="image"
                            value={newProject.image}
                            onChange={handleInputChange}
                            placeholder="URL da Imagem"
                            required
                        />
                        <br />
                        <input
                            type="text"
                            name="price"
                            value={newProject.price}
                            onChange={handleInputChange}
                            placeholder="Preço"
                            required
                        />
                        <br />
                        <button type="submit">{editingProject ? 'Atualizar Produto' : 'Adicionar Produto'}</button>
                    </form>
                    {/* Botão de voltar para a lista de produtos */}
                    <button onClick={() => setView('viewProducts')}>Voltar para Lista de Produtos</button>
                </section>

        )}
    </div>
);
}
export default App;