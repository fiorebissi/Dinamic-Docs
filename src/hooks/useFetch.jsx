import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import Swal from 'sweetalert2';

const useFetch = (url, errorMessage = '', functionDataOk = () => {}) => {
  const { data, error } = useSWR(url, (url) => {
    return fetch(url)
      .then((response) => response.json());
  });
  const flag = useRef(0);

  useEffect(() => {
    if (error) {
      console.log(error);
      Swal.fire(
        'Error',
        errorMessage,
        'error',
      );
    }
    if (data) {
      console.log(data);
      if (flag.current === 0) {
        if (data.type !== 'success') {
          Swal.fire(
            'Error',
            errorMessage,
            'error',
          );
        } else {
          functionDataOk();
        }
        flag.current === 1;
      }
    }
  }, [error, data]);

  return { data, error };
};

export default useFetch;
