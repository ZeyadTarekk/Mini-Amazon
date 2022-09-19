const deleteProduct = async (btn) => {
  const productId = btn.parentNode.querySelector("[name=prodId]").value;
  const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;
  const productElement = btn.closest("article");
  try {
    const response = await fetch(`/admin/product/${productId}`, {
      method: "DELETE",
      headers: {
        "csrf-token": csrfToken,
      },
    });
    const result = await response.json();
    console.log(result);
    productElement.parentNode.removeChild(productElement);
  } catch (err) {
    console.log(err);
  }
};
