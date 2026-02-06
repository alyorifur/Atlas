// form-validation.js - Validação avançada do formulário de contato

// Configurações do EmailJS (VERIFIQUE SEUS DADOS)
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_w3j91ej',     // Seu Service ID
    TEMPLATE_ID: 'template_4cw38kf',   // Seu Template ID
    USER_ID: 'fNfAEWIXY3UplZF5-'       // Seu Public Key
};

// Mapa de serviços para nomes amigáveis
const SERVICE_NAMES = {
    'financeira': 'Consultoria Financeira',
    'processos': 'Otimização de Processos',
    'digital': 'Transformação Digital',
    'estrategica': 'Consultoria Estratégica',
    'outro': 'Outro Serviço'
};

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Elementos do formulário - CORRIGIDO
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const companyInput = document.getElementById('company');
    const serviceSelect = document.getElementById('service');
    const messageTextarea = document.getElementById('message');
    const newsletterCheckbox = document.getElementById('newsletter');
    const termsCheckbox = document.getElementById('terms');
    const submitButton = contactForm.querySelector('.btn-submit');
    
    // Elementos para validação de funcionários - NOVO
    const employeeRadios = document.querySelectorAll('input[name="employees"]');
    const radioGroup = document.querySelector('.radio-group');
    
    // Modal de sucesso
    const successModal = document.getElementById('successModal');
    
    // Inicializar EmailJS - CORRIGIDO
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init(EMAILJS_CONFIG.USER_ID);
            console.log('EmailJS inicializado');
        } catch (error) {
            console.error('Erro ao inicializar EmailJS:', error);
        }
    } else {
        console.error('EmailJS não carregado');
    }
    
    // ===== FUNÇÕES DE VALIDAÇÃO =====
    
    // 1. VALIDAÇÃO DE NOME COMPLETO
    function isValidName(name) {
        const trimmedName = name.trim();
        
        // Verifica tamanho
        if (trimmedName.length < 2 || trimmedName.length > 100) {
            return false;
        }
        
        // Verifica se tem pelo menos um espaço (nome e sobrenome)
        if (!trimmedName.includes(' ')) {
            return false;
        }
        
        // Verifica caracteres válidos
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.'-]+$/;
        return nameRegex.test(trimmedName);
    }
    
    // 2. VALIDAÇÃO DE NOME DA EMPRESA - AGORA OBRIGATÓRIO
    function isValidCompany(company) {
        if (!company || company.trim() === '') return false; // AGORA É OBRIGATÓRIO
        
        const trimmedCompany = company.trim();
        
        // Verifica tamanho
        if (trimmedCompany.length < 2 || trimmedCompany.length > 100) {
            return false;
        }
        
        // Verifica se contém pelo menos uma letra
        const hasLetters = /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(trimmedCompany);
        if (!hasLetters) {
            return false;
        }
        
        // Verifica caracteres válidos
        const companyRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s&.,'()-]+$/;
        return companyRegex.test(trimmedCompany);
    }
    
    // 3. VALIDAÇÃO DE NÚMERO DE FUNCIONÁRIOS - CORRIGIDO
    function isValidEmployees() {
        const selected = Array.from(employeeRadios).some(radio => radio.checked);
        
        if (!selected) {
            showEmployeesError('Selecione o número de funcionários');
            return false;
        }
        
        clearEmployeesError();
        return true;
    }
    
    function showEmployeesError(message) {
        const errorElement = document.getElementById('employeesError');
        
        if (radioGroup) {
            radioGroup.classList.add('error');
            radioGroup.classList.remove('valid');
            radioGroup.style.border = '1px solid var(--danger)';
            radioGroup.style.borderRadius = 'var(--radius)';
            radioGroup.style.padding = '0.5rem';
            radioGroup.style.marginTop = '0.5rem';
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        // Animação de shake
        if (radioGroup) {
            radioGroup.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                radioGroup.style.animation = '';
            }, 500);
        }
    }
    
    function clearEmployeesError() {
        const errorElement = document.getElementById('employeesError');
        
        if (radioGroup) {
            radioGroup.classList.remove('error');
            radioGroup.classList.add('valid');
            radioGroup.style.border = '1px solid var(--success)';
            radioGroup.style.borderRadius = 'var(--radius)';
            radioGroup.style.padding = '0.5rem';
            radioGroup.style.marginTop = '0.5rem';
        }
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    // Adicionar validação em tempo real para radio buttons
    employeeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                clearEmployeesError();
            }
        });
    });
    
    // 4. VALIDAÇÃO DE E-MAIL
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 5. VALIDAÇÃO DE TELEFONE - CORRIGIDA
    function isValidPhone(phone) {
        // Remove todos os não-dígitos
        const digits = phone.replace(/\D/g, '');
        
        // Verifica se tem 10 ou 11 dígitos (com DDD fixo + celular)
        if (digits.length !== 10 && digits.length !== 11) {
            return false;
        }
        
        // Verifica se o DDD é válido (11 a 99)
        const ddd = digits.substring(0, 2);
        if (parseInt(ddd) < 11 || parseInt(ddd) > 99) {
            return false;
        }
        
        // Verifica formato brasileiro com máscara aplicada
        // Aceita: (99) 9999-9999 ou (99) 99999-9999
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }
    
    // 6. VALIDAÇÃO DE MENSAGEM
    function isValidMessage(message) {
        const trimmedMessage = message.trim();
        return trimmedMessage.length >= 10 && trimmedMessage.length <= 2000;
    }
    
    // ===== FUNÇÕES DE VALIDAÇÃO EM TEMPO REAL =====
    
    // Validação da empresa em tempo real - AGORA OBRIGATÓRIO
    companyInput.addEventListener('input', function() {
        validateFieldRealTime(companyInput, isValidCompany);
    });
    
    companyInput.addEventListener('blur', function() {
        validateField(companyInput, isValidCompany);
    });
    
    // Validação do nome
    nameInput.addEventListener('input', function() {
        validateFieldRealTime(nameInput, isValidName);
    });
    
    nameInput.addEventListener('blur', function() {
        validateField(nameInput, isValidName);
    });
    
    // Validação do email
    emailInput.addEventListener('input', function() {
        validateFieldRealTime(emailInput, isValidEmail);
    });
    
    emailInput.addEventListener('blur', function() {
        validateField(emailInput, isValidEmail);
    });
    
    // Validação do telefone
    phoneInput.addEventListener('input', function() {
        applyPhoneMask(phoneInput);
        validateFieldRealTime(phoneInput, isValidPhone);
    });
    
    phoneInput.addEventListener('blur', function() {
        validateField(phoneInput, isValidPhone);
    });
    
    // Validação da mensagem
    messageTextarea.addEventListener('input', function() {
        validateFieldRealTime(messageTextarea, isValidMessage);
        updateCharCounter(this);
    });
    
    messageTextarea.addEventListener('blur', function() {
        validateField(messageTextarea, isValidMessage);
    });
    
    // Validação do select
    serviceSelect.addEventListener('change', function() {
        const errorElement = document.getElementById('serviceError') || 
                           this.parentElement.querySelector('.error-message');
        
        if (!this.value) {
            showError(this, errorElement, 'Selecione um serviço');
        } else {
            clearError(this, errorElement);
        }
    });
    
    // ===== FUNÇÕES AUXILIARES DE VALIDAÇÃO =====
    
    function validateField(input, validator, isRequired = true) {
        const errorElement = document.getElementById(input.id + 'Error');
        const value = input.value.trim();
        
        // Campo vazio
        if (!value && isRequired) {
            showError(input, errorElement, 'Este campo é obrigatório');
            return false;
        }
        
        // Campo opcional vazio = válido
        if (!value && !isRequired) {
            clearError(input, errorElement);
            return true;
        }
        
        // Validação específica do campo
        if (!validator(value)) {
            showError(input, errorElement, getErrorMessage(input, validator));
            return false;
        }
        
        clearError(input, errorElement);
        return true;
    }
    
    function validateFieldRealTime(input, validator, isRequired = true) {
        const errorElement = document.getElementById(input.id + 'Error');
        const value = input.value.trim();
        
        // Marca como tocado
        if (value || input.hasAttribute('data-touched')) {
            input.setAttribute('data-touched', 'true');
        }
        
        // Validação em tempo real
        if (value && !validator(value)) {
            showError(input, errorElement, getErrorMessage(input, validator));
        } else if (!value && isRequired && input.hasAttribute('data-touched')) {
            showError(input, errorElement, 'Este campo é obrigatório');
        } else {
            clearError(input, errorElement);
        }
    }
    
    function getErrorMessage(input, validator) {
        if (validator === isValidName) {
            if (!input.value.includes(' ')) {
                return 'Digite nome e sobrenome';
            }
            return 'Digite um nome completo válido';
        }
        
        if (validator === isValidCompany) {
            if (!input.value.trim()) {
                return 'Este campo é obrigatório';
            }
            return 'Digite um nome de empresa válido (2-100 caracteres, pelo menos uma letra)';
        }
        
        if (validator === isValidEmail) {
            return 'Digite um e-mail válido (exemplo@email.com)';
        }
        
        if (validator === isValidPhone) {
            const digits = input.value.replace(/\D/g, '');
            
            if (digits.length === 0) {
                return 'Este campo é obrigatório';
            }
            
            if (digits.length !== 10 && digits.length !== 11) {
                return 'Digite um telefone válido (10 ou 11 dígitos)';
            }
            
            const ddd = digits.substring(0, 2);
            if (parseInt(ddd) < 11 || parseInt(ddd) > 99) {
                return 'DDD inválido. Use um código entre 11 e 99';
            }
            
            return 'Digite um telefone válido (ex: (11) 9999-8888 ou (11) 99999-8888)';
        }
        
        if (validator === isValidMessage) {
            return 'Mensagem deve ter entre 10 e 2000 caracteres';
        }
        
        return 'Campo inválido';
    }
    
    function showError(input, errorElement, message) {
        if (!input || !errorElement) return;
        
        input.classList.add('error');
        input.style.borderColor = 'var(--danger)';
        input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function clearError(input, errorElement) {
        if (!input || !errorElement) return;
        
        input.classList.remove('error');
        input.style.borderColor = '';
        input.style.boxShadow = '';
        
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    // ===== MÁSCARA DE TELEFONE - MELHORADA =====
    function applyPhoneMask(input) {
        let value = input.value.replace(/\D/g, '');
        
        // Limita a 11 dígitos
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        // Formato: (99) 99999-9999 (celular) ou (99) 9999-9999 (fixo)
        if (value.length > 10) {
            // Celular: 11 dígitos
            value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 6) {
            // Fixo: 10 dígitos ou celular parcial
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            // Apenas DDD + início
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length > 0) {
            // Apenas DDD
            value = value.replace(/^(\d{0,2})/, '($1');
        }
        
        input.value = value;
        
        // Disparar validação em tempo real
        if (input.hasAttribute('data-touched') || value.length > 0) {
            validateFieldRealTime(phoneInput, isValidPhone);
        }
    }
    
    // ===== CONTADOR DE CARACTERES =====
    function updateCharCounter(textarea) {
        let counter = textarea.parentElement.querySelector('.char-counter');
        
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'char-counter';
            textarea.parentElement.appendChild(counter);
        }
        
        const length = textarea.value.length;
        counter.textContent = `${length}/2000 caracteres`;
        counter.style.color = length >= 10 && length <= 2000 ? 'var(--success)' : 'var(--danger)';
    }
    
    // ===== VALIDAÇÃO DOS TERMOS =====
    termsCheckbox.addEventListener('change', function() {
        const errorElement = document.getElementById('termsError');
        
        if (!this.checked) {
            if (errorElement) {
                errorElement.textContent = 'Você deve aceitar os termos';
                errorElement.style.display = 'block';
            }
        } else {
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        }
    });
    
    // ===== VALIDAÇÃO COMPLETA DO FORMULÁRIO =====
    function validateAllFields() {
        const validations = [
            validateField(nameInput, isValidName),
            validateField(emailInput, isValidEmail),
            validateField(phoneInput, isValidPhone),
            validateField(messageTextarea, isValidMessage),
            validateField(companyInput, isValidCompany), // AGORA OBRIGATÓRIO
            isValidEmployees(),
            serviceSelect.value !== '',
            termsCheckbox.checked
        ];
        
        return validations.every(v => v === true);
    }
    
    // ===== ENVIO DE E-MAIL COM EMAILJS - CORRIGIDO =====
async function sendEmail(formData) {
    try {
        console.log('Enviando e-mail com dados:', formData);
        
        // Adicione estas variáveis que o template espera
        const now = new Date();
        
        const templateParams = {
            name: formData.name || 'Não informado',
            email: formData.email || 'Não informado',
            phone: formData.phone || 'Não informado',
            company: formData.company || 'Não informado',
            service: SERVICE_NAMES[formData.service] || formData.service || 'Não informado',
            employees: formData.employees || 'Não informado',
            message: formData.message || 'Não informado',
            date: now.toLocaleDateString('pt-BR'),
            time: now.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };
        
        console.log('Template params:', templateParams);
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('E-mail enviado com sucesso:', response);
        
        return {
            success: true,
            message: 'E-mail enviado com sucesso!',
            response: response
        };
        
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        console.error('Detalhes do erro:', {
            code: error.status,
            text: error.text,
            config: EMAILJS_CONFIG
        });
        
        return {
            success: false,
            message: 'Erro ao enviar o formulário. Por favor, tente novamente mais tarde.',
            error: error
        };
    }
}
    // ===== ENVIO DO FORMULÁRIO =====
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Formulário submetido');
        
        // Validar todos os campos
        if (!validateAllFields()) {
            console.log('Formulário inválido');
            
            const firstError = contactForm.querySelector('.error, .radio-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (firstError.tagName === 'INPUT' || firstError.tagName === 'SELECT' || firstError.tagName === 'TEXTAREA') {
                    firstError.focus();
                }
            }
            
            showErrorNotification('Por favor, corrija os erros no formulário.');
            return;
        }
        
        console.log('Formulário válido, coletando dados...');
        
        // Coletar dados
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            company: companyInput.value.trim(),
            service: serviceSelect.value,
            employees: document.querySelector('input[name="employees"]:checked')?.value || '',
            message: messageTextarea.value.trim(),
            newsletter: newsletterCheckbox.checked
        };
        
        console.log('Dados coletados:', formData);
        
        // Mostrar loading
        contactForm.classList.add('form-submitting');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        try {
            console.log('Enviando e-mail...');
            const emailResult = await sendEmail(formData);
            
            if (emailResult.success) {
                console.log('E-mail enviado com sucesso');
                showSuccess(formData);
                
            } else {
                console.error('Erro ao enviar e-mail:', emailResult.error);
                showErrorNotification(emailResult.message || 'Erro ao enviar formulário.');
                contactForm.classList.remove('form-submitting');
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitação';
            }
            
        } catch (error) {
            console.error('Erro inesperado:', error);
            showErrorNotification('Erro inesperado. Tente novamente.');
            contactForm.classList.remove('form-submitting');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitação';
        }
    });
    
    // ===== NOTIFICAÇÕES =====
    function showSuccess(formData) {
        // Limpar formulário
        contactForm.reset();
        contactForm.classList.remove('form-submitting');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitação';
        
        // Remover estados de validação
        if (radioGroup) {
            radioGroup.classList.remove('valid', 'error');
            radioGroup.style.border = '';
        }
        
        // Resetar data-touched
        [nameInput, emailInput, phoneInput, companyInput, messageTextarea].forEach(input => {
            input.removeAttribute('data-touched');
        });
        
        // Atualizar modal
        const modal = successModal;
        const serviceName = SERVICE_NAMES[formData.service] || formData.service;
        
        modal.querySelector('p').innerHTML = `
            Obrigado, <strong>${formData.name}</strong>!<br><br>
            Sua solicitação para <strong>${serviceName}</strong> foi recebida com sucesso.<br>
            Entraremos em contato em até 2 horas úteis.
        `;
        
        // Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--danger);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // ===== FUNÇÕES AUXILIARES =====
    window.closeModal = function() {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    // Fechar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
    });
    
    // Adicionar CSS para animações
    const styles = document.createElement('style');
    styles.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100%); }
        }
        
        .char-counter {
            font-size: 0.75rem;
            margin-top: 0.25rem;
            text-align: right;
            color: var(--gray-500);
        }
        
        .radio-group.error {
            border-color: var(--danger) !important;
            background: rgba(239, 68, 68, 0.05);
        }
        
        .radio-group.valid {
            border-color: var(--success) !important;
            background: rgba(16, 185, 129, 0.05);
        }
        
        .form-submitting {
            opacity: 0.7;
            pointer-events: none;
        }
        
        .form-submitting .btn-submit {
            position: relative;
        }
        
        .form-submitting .btn-submit i.fa-spinner {
            display: inline-block;
        }
        
        .form-submitting .btn-submit i.fa-paper-plane {
            display: none;
        }
    `;
    document.head.appendChild(styles);
    
    // ===== FUNÇÃO DE TESTE =====
    window.fillTestData = function() {
        nameInput.value = 'João Silva Santos';
        emailInput.value = 'joao@empresa.com';
        phoneInput.value = '(11) 99999-8888';
        companyInput.value = 'Tech Solutions Brasil';
        serviceSelect.value = 'digital';
        messageTextarea.value = 'Gostaria de uma consultoria para transformação digital. Temos 50 funcionários.';
        
        // Marcar radio button
        document.querySelector('input[name="employees"][value="51-200"]').checked = true;
        termsCheckbox.checked = true;
        
        // Disparar eventos de validação
        ['input', 'blur'].forEach(event => {
            nameInput.dispatchEvent(new Event(event));
            emailInput.dispatchEvent(new Event(event));
            phoneInput.dispatchEvent(new Event(event));
            companyInput.dispatchEvent(new Event(event));
            messageTextarea.dispatchEvent(new Event(event));
        });
        
        // Disparar evento para radio buttons
        clearEmployeesError();
        
        alert('Dados de teste preenchidos!');
    };
    
    // Inicializar contador de caracteres se já houver texto
    if (messageTextarea.value.length > 0) {
        updateCharCounter(messageTextarea);
    }
});