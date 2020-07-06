import React from 'react';
import {Text, StyleSheet} from 'react-native';

interface IProps {
  meuTitulo: string;
}

const Test: React.FC<IProps> = ({meuTitulo}) => {
  return <Text style={styles.text}>{meuTitulo}</Text>;
};

const styles = StyleSheet.create({
  text: {
    flex: 1,
    fontSize: 30,
    textAlign: 'center',
    color: '#7159c1',
  },
});

export default Test;
