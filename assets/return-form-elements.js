if (!customElements.get('order-select')) {
  customElements.define(
    'order-select',

    class OrderSelect extends HTMLElement {
      constructor() {
        super();

        this.orderSelect = this.querySelector('#orderSelect');
        this.productsTitle = this.querySelector('.products__title');
        this.productsList = this.querySelector('.products__list');
        this.productListValues = this.querySelector('.product-list-values');
        this.orderSelect.addEventListener('change', this.onChangeOrder.bind(this));
      }

      onChangeOrder(event) {
        const orderUrl = document.getElementById(`${event.target.value}`).dataset.url;
        try {
          fetch(`${orderUrl}?view=return_form`)
            .then(res => res.json())
            .then(data => {
              this.productsTitle.innerText = data.title;

              //Remove old data
              this.productsList.innerHTML = '';

              data.items.map((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                  <label class="product-item">
                    <input class="product-item__checkbox" type="checkbox" value="${item.title}" name="products"/>
                    <span class="product-item__custom-checkbox"></span>
                    <div class="product-item__img-block"><img src="${item.img}"/></div>
                    <p>${item.title}</p>
                  </label>
                `;
                this.productsList.appendChild(li);
              })

              const productItemCheckboxes = document.querySelectorAll('.product-item__checkbox');
              const productsListInput = document.querySelector('.products-list-values');

              productItemCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', event => {
                
                  if (checkbox.checked) {
                    productsListInput.value += checkbox.value + ', ';
                  } else {
                    productsListInput.value = productsListInput.value.replace(checkbox.value + ', ', '');
                  }
                });
              });
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
        this.productListValues = this.querySelector('.products-list-values');
        this.errorMessage = this.querySelector('.return-form__error');
      }

      onSubmitHandler(e) {
        e.preventDefault();
        this.successMessage.classList.add('none');
        const formData = new FormData(this.form);
        const formValues = {};

        for (const entry of formData.entries()) {
          formValues[entry[0]] = entry[1];
        }

        if(this.productListValues != null && this.productListValues.value == '') {
          this.errorMessage.classList.remove('none')
          this.errorMessage.innerText = 'Choose atleast one product!'
        } else {
          this.errorMessage.classList.add('none')
          this.errorMessage.innerText = '';
          this.loader.classList.remove('loader-none')
        this.form.querySelector('.return-form__fields').classList.add('submitting');
        // Send the form data to the API Gateway.
        fetch('https://bfg7yldc83.execute-api.us-east-1.amazonaws.com/new/submitdata', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(formValues)
        })
          .then(response => response.json())
          .then(response => {
            this.form.querySelectorAll('input, select, textarea').forEach((field) => {
              field.value = '';
            });
            this.form.querySelector('.return-form__fields').classList.remove('submitting');
            this.loader.classList.add('loader-none');
            this.successMessage.classList.remove('none');
            this.successMessage.innerText = response.body;

            if (this.productsList && this.productsTitle) {
              this.productsTitle.innerText = 'Products:';
              this.productsList.innerHTML = 'Select order to choose products for return!';
            }

          })

          .catch(error => {
            console.log(error);
          });
        }
        


      }
    }
  )
}