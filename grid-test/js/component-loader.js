document.addEventListener('DOMContentLoaded', () => {

  const componentElements = document.querySelectorAll('.load-component');
  
  componentElements.forEach(async (element) => {
    const tagName = element.tagName.toLowerCase();

    // Allow overriding the file name with a data-component attribute
    const componentName = element.getAttribute('data-component') || tagName;

    const filePath = `./components/${tagName}.html`;
    
    try {
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // Keep any attributes from the original element
      const attributes = element.attributes;
      
      // Insert the component content
      element.innerHTML = content;
      
      // Execute any scripts inside the loaded content
      const scripts = element.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        
        // Copy attributes
        Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy content
        newScript.textContent = script.textContent;
        
        // Replace the old script with the new one
        script.parentNode.replaceChild(newScript, script);
      });
      
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
      element.innerHTML = `<div class="error">Failed to load ${componentName} component</div>`;
    }
  });
});