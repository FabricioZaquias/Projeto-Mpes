import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ name: '', description: '', image: '', price: '' });
    const [editingProject, setEditingProject] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ username: '', password: '' });
    const [view, setView] = useState('viewProducts'); // Estado para alternar entre as telas

    const handleRegister = (e) => {
        e.preventDefault();
        const { username, password } = registerForm;
        const existingUser = JSON.parse(localStorage.getItem(username));
        if (existingUser) {
            alert('Usuário já existe');
        } else {
            localStorage.setItem(username, JSON.stringify({ username, password }));
            alert('Usuário registrado com sucesso!');
            setIsRegistering(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const { username, password } = loginForm;
        const storedUser = JSON.parse(localStorage.getItem(username));
        if (storedUser && storedUser.password === password) {
            setIsAuthenticated(true);
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
        setNewProject(prevState => ({ ...prevState, [name]: value }));
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

    if (!isAuthenticated) {
        return (
            <div>
                {isRegistering ? (
                    <div>
                        <h2>Cadastro</h2>
                        <form onSubmit={handleRegister}>
                            <input
                                type="text"
                                name="username"
                                value={registerForm.username}
                                onChange={handleRegisterChange}
                                placeholder="Usuário"
                                required
                            />
                            <br />
                            <input
                                type="password"
                                name="password"
                                value={registerForm.password}
                                onChange={handleRegisterChange}
                                placeholder="Senha"
                                required
                            />
                            <br />
                            <button type="submit">Cadastrar</button>
                        </form>
                        <p>Já tem uma conta? <button onClick={() => setIsRegistering(false)}>Faça login</button></p>
                    </div>
                ) : (
                    <div>
                        <h2>Login</h2>
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                name="username"
                                value={loginForm.username}
                                onChange={handleLoginChange}
                                placeholder="Usuário"
                                required
                            />
                            <br />
                            <input
                                type="password"
                                name="password"
                                value={loginForm.password}
                                onChange={handleLoginChange}
                                placeholder="Senha"
                                required
                            />
                            <br />
                            <button type="submit">Entrar</button>
                        </form>
                        <p>Não tem uma conta? <button onClick={() => setIsRegistering(true)}>Cadastre-se</button></p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <nav style={{ backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '20px' }}>
                {/* Exibe o botão de adicionar produto apenas se não estiver na tela de adição de produto */}
                {view !== 'addProduct' && (
                    <button onClick={() => setView('addProduct')}>Adicionar Produto</button>
                )}
            </nav>

            {view === 'viewProducts' && (
                <section id="projectList">
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
