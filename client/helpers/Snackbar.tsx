import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { FONT, SIZES } from '../constants';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Snackbar = ({ isVisible, message, onHide, type }) => {

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onHide();
    }, 6000);

    return () => clearTimeout(timeoutId);
  }, [isVisible]);

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isVisible}
      onRequestClose={() => onHide()}
    >
      <View style={styles.container}>
        <View 
          style={{
            backgroundColor: type === 'error' ? '#FF4C4C' : '#006600',
            padding: 15,
            borderRadius: 5,
            flexDirection: 'column',
            width: '80%'
          }}
        >
          {/* <TouchableOpacity onPress={() => onHide()}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end'
            }}
          >
            <FontAwesome
              name="close"
              size={20}
              color={'white'}
            />
          </TouchableOpacity> */}
          <Text
            style={{
              color: 'white',
              fontFamily: FONT.bold,
              fontSize: SIZES.medium,
              alignSelf: 'center'
            }}
          >{message}</Text>
        </View>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1} 
          onPress={() => onHide()}
        />
        {/* End Transparent Touchable Overlay */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});

export default Snackbar;
