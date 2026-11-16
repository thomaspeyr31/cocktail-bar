const IDENTIFIER_REGEX = /^[a-zA-Z0-9]{8,12}$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{12,64}$/;

function validateIdentifier(identifiant) {
  return IDENTIFIER_REGEX.test(identifiant);
}

function validatePassword(password) {
  return PASSWORD_REGEX.test(password);
}

function validateLoginBody(req, res, next) {
  const { identifiant, password } = req.body;

  if (!identifiant || !validateIdentifier(identifiant)) {
    return res.status(400).json({
      error: 'Identifiant invalide (8-12 caractères alphanumériques)',
    });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({
      error: 'Mot de passe invalide (12-64 chars, 1 majuscule, 1 chiffre, 1 spécial)',
    });
  }

  next();
}

function validateUserBody(req, res, next) {
  const { nom, prenom, identifiant, password, role } = req.body;
  const validRoles = ['user', 'staff', 'admin'];

  if (!nom || !prenom) {
    return res.status(400).json({ error: 'Nom et prénom requis' });
  }

  if (!identifiant || !validateIdentifier(identifiant)) {
    return res.status(400).json({
      error: 'Identifiant invalide (8-12 caractères alphanumériques)',
    });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({
      error: 'Mot de passe invalide (12-64 chars, 1 majuscule, 1 chiffre, 1 spécial)',
    });
  }

  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide (user, staff, admin)' });
  }

  next();
}

module.exports = {
  validateIdentifier,
  validatePassword,
  validateLoginBody,
  validateUserBody,
};
