if (!customElements.get('order-select')) {
  customElements.define(
    'order-select',

    class OrderSelect extends HTMLElement {
      constructor() {
        super();

        this.orderSelect = this.querySelector('#orderSelect');
        this.productsTitle = this.querySelector('.products__title');
        this.productsList = this.querySelector('.products__list');
        this.orderSelect.addEventListener('change', this.onChangeOrder.bind(this));
      }

      createProductItemHTML(data) {

        this.productsTitle.innerText = data.title;

        //Remove old data
        this.productsList.innerHTML = '';

        data.items.map((item, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            <label class="product-item">
              <input class="product-item__checkbox" type="checkbox" value="${item.title}" name="contact[product_${index + 1}]"/>
              <span class="product-item__custom-checkbox"></span>
              <div class="product-item__img-block"><img src="${item.img}"/></div>
              <p>${item.title}</p>
            </label>
          `;

          this.productsList.appendChild(li);
        })
      }

      onChangeOrder(event) {
        const orderUrl = document.getElementById(`${event.target.value}`).dataset.url;
        try {
          fetch(`${orderUrl}?view=return_form`)
            .then(res => res.json())
            .then(data => {
              console.log(this)
              this.productsTitle.innerText = data.title;

              //Remove old data
              this.productsList.innerHTML = '';

              data.items.map((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
            <label class="product-item">
              <input class="product-item__checkbox" type="checkbox" value="${item.title}" name="contact[product_${index + 1}]"/>
              <span class="product-item__custom-checkbox"></span>
              <div class="product-item__img-block"><img src="${item.img}"/></div>
              <p>${item.title}</p>
            </label>
          `;
                this.productsList.appendChild(li);
              })
            })
        } catch (error) {
          console.log(error)
        }

      }

    }
  )

}

if (!customElements.get('return-form')) {
  customElements.define('return-form',
    class OrderForm extends HTMLElement {
      constructor() {
        super();
        this.form = this.querySelector('#ReturnForm');
        this.productsTitle = this.querySelector('.products__title');
        this.productsList = this.querySelector('.products__list');
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.successMessage = this.querySelector('.return-form__success');
        this.loader = this.querySelector('.loader');
      }

      onSubmitHandler(e) {
        e.preventDefault();
        this.loader.classList.remove('loader-none')
        const name = document.querySelector('.return-form__name-field').value;
        this.form.querySelector('.return-form__fields').classList.add('submitting');
        // Send the form data to the API Gateway.
        fetch('https://bfg7yldc83.execute-api.us-east-1.amazonaws.com/new/submitdata', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            name: name
          })
        })
          .then(response => response.json())
          .then(response => {
            console.log(response)
            this.form.querySelectorAll('input, select, textarea').forEach((field) => {
              field.value = '';
            });
            this.form.querySelector('.return-form__fields').classList.remove('submitting');
            this.loader.classList.add('loader-none');
            this.successMessage.innerText = response.body;
            this.productsTitle.innerText = 'Products:';
            this.productsList.innerHTML = 'Select order to choose products for return!';
          })

          .catch(error => {
            console.log(error);
          });
      }
    }
  )
}