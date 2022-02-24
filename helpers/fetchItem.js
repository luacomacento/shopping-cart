const fetchItem = async (id) => {
  // seu código aqui
  const $ItemID = id;
  const URL = `https://api.mercadolibre.com/items/${$ItemID}`;

  return fetch(URL)
    .then((response) => response.json());
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
