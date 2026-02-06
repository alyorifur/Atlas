// whatsapp-config.js (ou adicione no main.js)
document.addEventListener('DOMContentLoaded', function() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    
    if (whatsappBtn) {
        // Página atual
        const currentPage = window.location.pathname.split('/').pop();
        let message = 'Olá! Gostaria de saber mais sobre os serviços da Atlas Consultoria.';
        
        // Personalizar mensagem baseada na página
        if (currentPage.includes('servicos')) {
            const service = window.location.hash.replace('#', '');
            if (service) {
                const serviceNames = {
                    'financeira': 'Consultoria Financeira',
                    'processos': 'Otimização de Processos',
                    'digital': 'Transformação Digital'
                };
                const serviceName = serviceNames[service] || service;
                message = `Olá! Tenho interesse na ${serviceName}. Pode me dar mais informações?`;
            }
        } else if (currentPage.includes('contato')) {
            message = 'Olá! Visitei o site e gostaria de conversar sobre uma consultoria.';
        }
        
        // Atualizar link do WhatsApp
        const encodedMessage = encodeURIComponent(message);
        whatsappBtn.href = `https://wa.me/5519991451994?text=${encodedMessage}`;
        
        // Adicionar evento para rastreamento (opcional)
        whatsappBtn.addEventListener('click', function() {
            // Aqui você pode adicionar Google Analytics ou outro tracker
            console.log('WhatsApp clicado da página:', currentPage);
        });
    }
    
    // Botão WhatsApp flutuante (opcional)
    createFloatingWhatsApp();
});

// Criar botão flutuante do WhatsApp
function createFloatingWhatsApp() {
    const floatingBtn = document.createElement('a');
    floatingBtn.href = 'https://wa.me/551991451994?text=Olá!%20Preciso%20de%20ajuda%20com%20minha%20empresa.';
    floatingBtn.className = 'floating-whatsapp';
    floatingBtn.target = '_blank';
    floatingBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    floatingBtn.title = 'Conversar no WhatsApp';
    
    // Estilos
    floatingBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: #25D366;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
        z-index: 1000;
        text-decoration: none;
        transition: all 0.3s ease;
        animation: float 3s ease-in-out infinite;
    `;
    
    // Efeito hover
    floatingBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 25px rgba(37, 211, 102, 0.5)';
    });
    
    floatingBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.3)';
    });
    
    // Adicionar ao corpo
    document.body.appendChild(floatingBtn);
    
    // Adicionar animação de flutuação
    const floatAnimation = document.createElement('style');
    floatAnimation.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
        
        @media (max-width: 768px) {
            .floating-whatsapp {
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                font-size: 24px;
            }
        }
    `;
    document.head.appendChild(floatAnimation);
}