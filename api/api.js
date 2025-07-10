import axios from 'axios'
import { ref } from 'vue'

const postData = ref('')

export const submitData = async () => {
  try {
    const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    postData.value = res.data
    console.log(res.data)
  } catch (error) {
    console.error('Error submitting data:', error)
  }
}

export { postData }
