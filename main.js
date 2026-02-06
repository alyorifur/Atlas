// main.js - Navegação e efeitos do site

document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVEGAÇÃO INTELIGENTE COM DESTAQUE ESPECIAL =====
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.querySelector('.nav-indicator');
    const navbar = document.querySelector('.navbar');
    
    // Função para destacar a página atual
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Mapear páginas para IDs
        const pageMap = {
            'index.html': 'home',
            'sobre.html': 'sobre',
            'servicos.html': 'servicos',
            'contato.html': 'contato'
        };
        
        const currentPageId = pageMap[currentPage] || 'home';
        
        // Remover classe active de todos os links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Adicionar classe active ao link correto
        const activeLink = document.querySelector(`.nav-link[data-page="${currentPageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            updateIndicator(activeLink);
        }
    }
    
    // FUNÇÃO SIMPLIFICADA PARA ATUALIZAR O INDICADOR
    function updateIndicator(activeLink) {
        if (!navIndicator || !activeLink) return;
        
        // Usar offsetLeft e offsetWidth para cálculos precisos
        const linkLeft = activeLink.offsetLeft;
        const linkWidth = activeLink.offsetWidth;
        
        // Aplicar posição e largura diretamente
        navIndicator.style.left = `${linkLeft}px`;
        navIndicator.style.width = `${linkWidth}px`;
        navIndicator.style.opacity = '1';
    }
    
    // Atualizar indicador no hover
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                const linkLeft = this.offsetLeft;
                const linkWidth = this.offsetWidth;
                
                navIndicator.style.left = `${linkLeft}px`;
                navIndicator.style.width = `${linkWidth}px`;
                navIndicator.style.opacity = '0.7';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink && !this.classList.contains('active')) {
                updateIndicator(activeLink);
            }
        });
    });
    
    // ===== NAVBAR SCROLL EFFECT =====
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Animar elementos na rolagem
        animateOnScroll();
    }
    
    // ===== ANIMAÇÃO AO SCROLL =====
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.animationPlayState = 'running';
            }
        });
    }
    
    // ===== FORMULÁRIO DE NEWSLETTER =====
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const button = this.querySelector('button');
            
            if (emailInput.value) {
                // Simular envio
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                button.disabled = true;
                
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    button.style.background = 'var(--success)';
                    emailInput.value = '';
                    
                    // Restaurar após 2 segundos
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.disabled = false;
                        button.style.background = '';
                    }, 2000);
                }, 1500);
            }
        });
    }
    
    // ===== INICIALIZAÇÃO =====
    function init() {
        // Destacar página atual
        highlightCurrentPage();
        
        // Configurar scroll
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Executar imediatamente
        
        // Animar elementos visíveis
        animateOnScroll();
        
        // Inicializar indicador
        setTimeout(() => {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) {
                updateIndicator(activeLink);
            }
        }, 100);
        
        // Atualizar indicador no resize
        window.addEventListener('resize', () => {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) {
                // Pequeno delay para garantir que o resize terminou
                setTimeout(() => {
                    updateIndicator(activeLink);
                }, 50);
            }
        });
    }
    
    // Inicializar tudo
    init();
    
    // ===== EFEITOS EXTRAS =====
    
    // Efeito de hover nos cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efeito de clique nos botões
    const buttons = document.querySelectorAll('.btn, .cta-button, .cta-button-large');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Criar efeito de ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Adicionar CSS para efeito ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .service-card {
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                       box-shadow 0.4s ease !important;
        }
    `;
    document.head.appendChild(style);
});