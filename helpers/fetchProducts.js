const fetchProducts = async (query) => {
  // seu código aqui
  const $QUERY = query;
  const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`;

  return fetch(URL)
    .then((data) => data.json());
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
