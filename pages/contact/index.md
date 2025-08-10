---
layout: default
title: Contact
permalink: /contact/
---

  <style>
    .card{background:#fff;padding:1.6rem;border-radius:12px;box-shadow:0 6px 18px rgba(15,15,15,0.06);width:100%;max-width:720px}
    h1{margin:0 0 0.25rem;font-size:1.25rem}
    p.lead{margin:0 0 1rem;color:#555}
    form{display:grid;gap:0.75rem}
    label{font-size:.88rem;color:#222}
    input[type="text"], input[type="email"], textarea{width:100%;padding:.6rem .75rem;border:1px solid #e6e6e8;border-radius:8px;font-size:1rem}
    textarea{min-height:140px;resize:vertical}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
    .actions{display:flex;gap:.5rem;align-items:center}
    button{background:#0b69ff;color:#fff;border:0;padding:.6rem .9rem;border-radius:10px;cursor:pointer}
    button[disabled]{opacity:.6;cursor:not-allowed}
    .note{font-size:.85rem;color:#666}
    .sr-only{position:absolute;left:-9999px}
    .msg{padding:.6rem;border-radius:8px}
    .msg.success{background:#e6ffef;color:#064b2b}
    .msg.error{background:#fff0f0;color:#6c0b0b}
  </style>

    <form id="contactForm" autocomplete="on" novalidate>
      <div class="row">
        <div>
          <label for="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Your full name" required minlength="2" />
        </div>

        <div>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
      </div>

      <div>
        <label for="subject">Subject / Title</label>
        <input id="subject" name="subject" type="text" placeholder="Short subject" required minlength="3" />
      </div>

      <div>
        <label for="message">Message</label>
        <textarea id="message" name="message" placeholder="Write your message here..." required minlength="10"></textarea>
      </div>

      <div class="actions">
        <button type="submit" id="sendBtn">Send message</button>
        <div class="note">Or send directly to <strong>celozaga@outlook.com</strong></div>
      </div>

      <!-- Accessible, SEO-friendly feedback area -->
      <div aria-live="polite" id="feedback" class="sr-only"></div>
    </form>

  <script>
    // Simple client-side validation and "mailto" fallback.
    // Keep this code short and easy to read/modify.
    (function(){
      const form = document.getElementById('contactForm');
      const feedback = document.getElementById('feedback');
      const sendBtn = document.getElementById('sendBtn');

      function setFeedback(text, type){
        feedback.textContent = text;
        feedback.className = type ? 'msg ' + type : 'msg';
        // make visible for screen readers
        feedback.classList.remove('sr-only');
      }

      function validate(formData){
        // small, explicit checks. Extend as needed.
        if(!formData.get('name') || formData.get('name').trim().length < 2) return 'Please enter a valid name.';
        const email = formData.get('email') || '';
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
        if(!formData.get('subject') || formData.get('subject').trim().length < 3) return 'Please provide a subject.';
        if(!formData.get('message') || formData.get('message').trim().length < 10) return 'Message is too short.';
        return '';
      }

      form.addEventListener('submit', function(e){
        e.preventDefault();
        sendBtn.disabled = true;

        const formData = new FormData(form);
        const error = validate(formData);
        if(error){
          setFeedback(error, 'error');
          sendBtn.disabled = false;
          return;
        }

        // If you have no backend, use mailto as a fallback. This opens the user's mail client.
        // For production, replace this block with a POST to your server or a 3rd-party service.
        const name = encodeURIComponent(formData.get('name'));
        const from = encodeURIComponent(formData.get('email'));
        const subject = encodeURIComponent(formData.get('subject'));
        const body = encodeURIComponent('From: ' + formData.get('name') + ' (' + formData.get('email') + ')\n\n' + formData.get('message'));

        // mailto approach (no server required):
        const mailto = `mailto:celozaga@outlook.com?subject=${subject}&body=${body}`;
        // Try opening the mail client. Some browsers may block window.location changes; it's expected.
        window.location.href = mailto;

        // Show a soft confirmation for users who do not have a mail client configured.
        setTimeout(()=>{
          setFeedback('If your email client did not open, copy the message and send to celozaga@outlook.com, or add a server endpoint for automatic delivery.', 'success');
          sendBtn.disabled = false;
        }, 800);

        // Example: to send via fetch to your backend, uncomment and modify below:
        /*
        fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            name:formData.get('name'),
            email:formData.get('email'),
            subject:formData.get('subject'),
            message:formData.get('message')
          })
        }).then(r=>r.json()).then(resp=>{
          setFeedback('Message sent — thanks!', 'success');
          form.reset();
          sendBtn.disabled = false;
        }).catch(err=>{
          setFeedback('Sending failed. Try again later.', 'error');
          sendBtn.disabled = false;
        });
        */
      });
    })();
  </script>