import fetch from "isomorphic-unfetch";
import { nanoid } from "nanoid";

//fetcher
export const fetcher = (url) => fetch(url).then((r) => r.json());

export const getFormValidations = () => {
  return {
    //name
    name: {
      required: {
        value: true,
        message: "Nombre es Requerido",
      },
      maxLength: {
        value: 40,
        message: "Maximo tamaño 40 caracteres",
      },
      minLength: {
        value: 5,
        message: "Minimo tamaño 5 caracteres",
      },
      pattern: {
        value: /^[A-Za-zñÑ ]{5,20}$/,
        message: "Nombre Incorrecto",
      },
    },

    //phone
    phone: {
      required: {
        value: true,
        message: "Celular es Requerido",
      },
      maxLength: {
        value: 20,
        message: "Maximo tamaño 20 caracteres",
      },
      minLength: {
        value: 5,
        message: "Minimo tamaño 5 caracteres",
      },
      pattern: {
        value: /^[0-9]{5,20}$/,
        message: "Nro Celular Incorrecto",
      },
    },
    //address
    address: {
      required: {
        value: true,
        message: "Dirección es requerida",
      },
      maxLength: {
        value: 50,
        message: "Maximo tamaño 50 caracteres",
      },
      minLength: {
        value: 5,
        message: "Minimo tamaño 5 caracteres",
      },
      pattern: {
        value: /^[0-9a-zA-Z-nÑ. ]{5,20}$/,
        message: "Dirección Incorrecta",
      },
    },
    //city
    city: {
      required: {
        value: true,
        message: "Distrio es requerido",
      },
    },
    //schedule
    schedule: {
      required: {
        value: true,
        message: "Horario es requerido",
      },
    },
    //extra comment
    comment: {
      maxLength: {
        value: 50,
        message: "Maximo tamaño 50 caracteres",
      },
    },
  };
};

//wsp url creator
export function getWspUrl(orderData) {
  const N = process.env.NEXT_PUBLIC_MY_PHONE_NUMBER;
  const ID = nanoid(8);
  const { cartItems, subTotal, withDelivery, shippingCost, total, formData } = orderData;
  const { name, phone, address, city, schedule, comment } = formData;

  let cartListforUrl = "";

  {
    Object.values(cartItems).forEach((item) => {
      const itemTotal = (item.offerPrice ? item.offerPrice * item.qty : item.price * item.qty).toFixed(2);
      cartListforUrl += `%0A%0A - *(${item.qty})* ${item.title} --> _*$${itemTotal}*_`;
    });
  }

  const WSP_URL = `https://api.whatsapp.com/send/?phone=${N}&text=%2A${"Order"}%3A%2A%20${ID}%0A%0A%2A${"Client"}%3A%2A%20${name}%0A%0A%2A${"Phone"}%3A%2A%20${phone}%0A%0A%2A${
    withDelivery ? "Dirección: " + "%3A%2A%20" + address + " %0A%0A%2A" : ""
  }${withDelivery ? "Distrito" + "%3A%2A%20" + city + "%0A%0A%2A" : ""}${
    withDelivery ? "Horario" + "%3A%2A%20" + schedule + "%0A%0A%2A" : ""
  }${comment ? "Comentarios:" + "%3A%2A%20" + comment + "%0A%0A%2A" : ""}${"Items List"}%3A%2A${cartListforUrl}%0A%0A%2A${
    withDelivery ? "Sub Total" + "%3A%2A%20$" + subTotal + " %0A%0A%2A" : ""
  }${withDelivery ? "Gastos de envío" + "%3A%2A%20$" + shippingCost + " %0A%0A%2A" : ""}${"Total"}%3A%2A%20${total}%0A%0A`;

  return WSP_URL;
}
