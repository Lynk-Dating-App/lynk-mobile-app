import React, { useState, useEffect } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import { View, Modal, Text, TouchableOpacity, Animated } from 'react-native';

interface IProps {
  modalVisible: boolean;
  setModalVisible: any;
  style: any;
  children: any;
  animationViewStyle: any;
  modalHeightKeyboardClose?: any;
  modalHeightKeyboardOpen?: any
}

const ReusableModal = ({
  modalVisible, setModalVisible, 
  style, children, animationViewStyle, modalHeightKeyboardClose, modalHeightKeyboardOpen
}: IProps) => {
  const animatedValue = new Animated.Value(0);
  const [modalHeight, setModalHeight] = useState('');

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [modalVisible]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setModalHeight(modalHeightKeyboardOpen);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setModalHeight(modalHeightKeyboardClose);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <Animated.View
          style={[{
            opacity,
            transform: [{ translateY }],
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }, animationViewStyle]}
        >
          <View style={[styles.container, {height: modalHeight}, style]}>
            {children}
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 5
  }
})

export default ReusableModal;
