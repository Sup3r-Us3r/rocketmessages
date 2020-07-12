import Toast from 'react-native-tiny-toast';

const ToastType = {
  error: (message: string) =>
    Toast.show(message, {
      position: Toast.position.TOP,
      textStyle: {
        color: '#fff',
        fontWeight: 'bold',
      },
      containerStyle: {
        backgroundColor: 'rgba(217, 26, 61, 0.85)',
        borderColor: '#d91a3d',
        borderRadius: 50,
        paddingHorizontal: 20,
      },
      animation: true,
      duration: 3000,
    }),
  success: (message: string) =>
    Toast.show(message, {
      position: Toast.position.TOP,
      textStyle: {
        color: '#fff',
        fontWeight: 'bold',
      },
      containerStyle: {
        backgroundColor: 'rgba(113, 89, 193, 0.85)',
        borderColor: '#7159c1',
        borderRadius: 50,
        paddingHorizontal: 20,
      },
      animation: true,
      duration: 3000,
    }),
};

export default ToastType;
