/* eslint-disable react/prop-types */
const ErrorMessageComponent = ({ message }) => {
  return (
    <span className="text-sm text-red-400">{message}</span>
  )
}

export default ErrorMessageComponent;