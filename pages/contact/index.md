---
layout: default
title: Contact
permalink: /contact/
---

<div class="contact-container">
  <form id="contactForm" autocomplete="on" novalidate class="contact-form">
    <div class="form-row">
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" placeholder="Your full name" required minlength="2" class="form-input" />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" required class="form-input" />
      </div>
    </div>

    <div class="form-group">
      <label for="subject">Subject / Title</label>
      <input id="subject" name="subject" type="text" placeholder="Short subject" required minlength="3" class="form-input" />
    </div>

    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" placeholder="Write your message here..." required minlength="10" class="form-textarea"></textarea>
    </div>

    <div class="form-actions">
      <button type="submit" id="sendBtn" class="form-btn">Send message</button>
      <div class="note">Or send directly to <strong>celozaga@outlook.com</strong></div>
    </div>

    <!-- Accessible, SEO-friendly feedback area -->
    <div aria-live="polite" id="feedback" class="sr-only"></div>
  </form>
</div>


{% raw %}
<script>
  // Simple client-side validation and "mailto" fallback.
  (function(){
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('feedback');
    const sendBtn = document.getElementById('sendBtn');

    function setFeedback(text, type){
      feedback.textContent = text;
      feedback.className = type ? 'msg ' + type : 'msg';
      feedback.classList.remove('sr-only');
    }

    function validate(formData){
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

      const subject = encodeURIComponent(formData.get('subject'));
      const body = encodeURIComponent(
        'From: ' + formData.get('name') + ' (' + formData.get('email') + ')\\n\\n' + formData.get('message')
      );

      window.location.href = `mailto:celozaga@outlook.com?subject=${subject}&body=${body}`;

      setTimeout(()=>{
        setFeedback('If your email client did not open, copy the message and send to celozaga@outlook.com.', 'success');
        sendBtn.disabled = false;
      }, 800);
    });
  })();
</script>
{% endraw %}
