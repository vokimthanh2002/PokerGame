import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';  // Import Spinner

const Signup = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);  // State để kiểm soát hiển thị Spinner

  
  const handleSignUp = async () => {
    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      alert('Password mismatch', 'Please make sure your passwords match.');
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Invalid email format', 'Please enter a valid email address.');
      return;
    }
    // Kiểm tra email đã tồn tại
    const emailCheckResponse = await fetch('http://10.0.2.2:3000/auth/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const emailCheckResult = await emailCheckResponse.json();

    if (emailCheckResult.exists) {
      alert('Email already exists', 'Please choose another email.');
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      alert('Weak password', 'Password must be at least 6 characters long.');
      return;
    }

    // Hiển thị Spinner khi đăng ký đang được thực hiện
    setLoading(true);

    // Gửi yêu cầu đăng ký đến server
    try {
      const response = await fetch('http://10.0.2.2:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        // Đăng ký thành công, có thể thực hiện các hành động khác (ví dụ: chuyển đến trang đăng nhập)
        // Ẩn Spinner sau khi hoàn thành đăng ký
        setLoading(false);
        navigation.navigate('VerifyOtp', { email, password });
      } else {
        // Đăng ký thất bại, xử lý thông báo hoặc hiển thị lỗi
        // Ẩn Spinner khi có lỗi
        setLoading(false);
        alert('Registration failed', result.message);
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
      // Ẩn Spinner khi có lỗi
      setLoading(false);
      alert('Error', 'Internal Server Error. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Spinner
        visible={loading}
        textContent={'Signing Up...'}
        textStyle={styles.spinnerText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  signupButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  spinnerText: {
    color: '#ffffff',
  },
});

export default Signup;
