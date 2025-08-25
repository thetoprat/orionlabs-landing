document.addEventListener('DOMContentLoaded', () => {
    const body=document.body;
    const scrollContainer=document.querySelector('.scroll-container');
    const scrollSections=document.querySelectorAll('.scroll-section');
    const particleContainer=document.getElementById('particle-container');

    const createParticles=()=>{
        const count=50;
        if(!particleContainer) return;
        for(let i=0;i<count;i++){
            const p=document.createElement('div');
            p.classList.add('particle');
            const size=Math.random()*3+1;
            p.style.width=`${size}px`;
            p.style.height=`${size}px`;
            p.style.left=`${Math.random()*100}%`;
            p.style.animationDuration=`${Math.random()*10+8}s`;
            p.style.animationDelay=`-${Math.random()*8}s`;
            particleContainer.appendChild(p);
        }
    };

    const themeToggle=document.getElementById('theme-toggle-btn');
    const themePalette=document.getElementById('theme-palette');
    const themeSwatches=document.querySelectorAll('.theme-swatch');
    const colorPreview=document.getElementById('current-color-preview');
    const THEME_KEY='orion_labs_selected_theme';

    const applyTheme=(name)=>{
        body.className=body.className.replace(/\btheme-[a-z-]+\b/g,'');
        body.classList.add(name);
        const sw=document.querySelector(`.theme-swatch[data-theme="${name}"]`);
        if(sw&&colorPreview) colorPreview.style.backgroundColor=sw.style.backgroundColor;
        try{localStorage.setItem(THEME_KEY,name)}catch{}
    };
    const loadTheme=()=>applyTheme(localStorage.getItem(THEME_KEY)||'theme-gold-dark');

    if(themeToggle) themeToggle.addEventListener('click',e=>{e.stopPropagation();themePalette.classList.toggle('active')});
    themeSwatches.forEach(s=>s.addEventListener('click',()=>{applyTheme(s.dataset.theme);themePalette.classList.remove('active')}));
    document.addEventListener('click',()=>themePalette.classList.remove('active'));
    if(themePalette) themePalette.addEventListener('click',e=>e.stopPropagation());

    if(scrollContainer){
        scrollContainer.addEventListener('scroll',()=>{
            if(scrollContainer.scrollTop>20) body.classList.add('scrolled'); else body.classList.remove('scrolled');
            const top=scrollContainer.scrollTop,h=scrollContainer.clientHeight;
            scrollSections.forEach(sec=>{
                const secTop=sec.offsetTop;
                const content=sec.querySelector('.section-content');
                if(!content) return;
                const progress=(secTop-top)/h;
                const opacity=1-Math.min(1,Math.abs(progress)*2);
                const translateY=progress*150;
                content.style.opacity=opacity;
                content.style.transform=`translateY(${translateY}px)`;
            });
        });
    }

    const modal=document.getElementById('contact-modal');
    if(modal){
        const modalContent=modal.querySelector('.modal-content');
        const open=document.getElementById('get-in-touch-btn');
        const cancel=document.getElementById('cancel-modal-btn');
        const ok=document.getElementById('success-ok-btn');
        const form=document.getElementById('contact-form');
        const status=document.getElementById('form-status');
        const openModal=()=>{modalContent.classList.remove('show-success');form.reset();status.textContent='';modal.classList.add('active')};
        const closeModal=()=>modal.classList.remove('active');
        if(open) open.addEventListener('click',openModal);
        if(cancel) cancel.addEventListener('click',closeModal);
        if(ok) ok.addEventListener('click',closeModal);
        if(form){
            form.addEventListener('submit',async e=>{
                e.preventDefault();
                status.textContent='Sending...';
                const data=new FormData(form);
                const payload={embeds:[{title:`New Contact Form Submission: ${data.get('subject')}`,color:14742302,fields:[{name:'Email',value:data.get('email'),inline:true},{name:'Service',value:data.get('service'),inline:true},{name:'Summary',value:data.get('summary')}],timestamp:new Date().toISOString()}]};
                try{
                    const r=await fetch('https://discord.com/api/webhooks/1401079578428047461/3TVl-6aLMJbo7beUj2J1axl-wwVkv6Szhzkq92gfRGrliZ9LBxuClbnviLBAC2ig4mQz',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
                    if(r.ok) modalContent.classList.add('show-success'); else throw new Error(`Status ${r.status}`);
                }catch{status.textContent='Failed to send message.';status.style.color='#ff6b6b'}
            });
        }
    }

    loadTheme();
    createParticles();
});
