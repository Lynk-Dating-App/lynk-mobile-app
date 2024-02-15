import React, { useEffect } from 'react';
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
            backgroundColor: type === 'error' ? '#ffcdd2' : '#b2dfdb',
            padding: 15,
            borderRadius: 5,
            flexDirection: 'row',
            width: '80%',
            borderWidth: 0.2,
            borderColor: type === 'error' ? '#CC6060' : '#337066',
            gap: 8
          }}
        >
          <FontAwesome
            name={type === 'error' ? "exclamation-circle" : "check-circle"}
            size={20}
            color={type === 'error' ? '#b71c1c' : '#004d40'}
          />
          <Text
            style={{
              color: type === 'error' ? '#b71c1c' : '#004d40',
              fontFamily: FONT.semiBold,
              fontSize: SIZES.small,
              textAlign: 'center',
              width: '90%'
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
