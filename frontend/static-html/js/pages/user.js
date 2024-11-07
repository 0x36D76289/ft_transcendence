export function render() {
  return `
    <div class="user-container">
      <header class="user-header">
        <h1>Profil Utilisateur</h1>
      </header>
      <div class="user-info">
        <div class="user-item">
          <label for="user-name">Nom:</label>
          <input type="text" id="user-name" class="user-control" value="John Doe">
        </div>
        <div class="user-item">
          <label for="user-email">Email:</label>
          <input type="email" id="user-email" class="user-control" value="john.doe@example.com">
        </div>
        <div class="user-item">
          <label for="user-phone">Téléphone:</label>
          <input type="tel" id="user-phone" class="user-control" value="+1234567890">
        </div>
        <div class="user-item">
          <label for="user-address">Adresse:</label>
          <input type="text" id="user-address" class="user-control" value="123 Rue Exemple, Paris">
        </div>
        <button id="save-button" class="save-button">Sauvegarder</button>
      </div>
    </div>
  `;
}

export function init() {
  document.getElementById('save-button').addEventListener('click', () => {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const phone = document.getElementById('user-phone').value;
    const address = document.getElementById('user-address').value;

    // Sauvegarder les informations utilisateur (par exemple, en les envoyant à un serveur)
    console.log('Informations utilisateur sauvegardées:', { name, email, phone, address });
  });
}
