import React from 'react';

function TestRegister() {
    const handleClick = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/usuarios/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: 'Daniel Bolanos',
                    email: 'dabohe@example.com',
                    password: 'A1b2c3d4',
                    tipo_usuarios: 'cliente',
                    telefono: '88889999',
                }),
            });

            const data = await response.json();
            console.log(data);
            alert(data.message || data.error);

        } catch (error) {
            console.error('Error al registrar:', error);
            alert('Error al conectar con el backend');
        }
    };

    return (
        <button onClick={handleClick}>
            Probar Registro
        </button>
    );
}

export default TestRegister;
