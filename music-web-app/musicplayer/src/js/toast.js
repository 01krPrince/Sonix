// class Toast {
//     constructor() {
//         this.createToastContainer();
//     }

//     createToastContainer() {
//         if (!document.querySelector('.toast-container')) {
//             const container = document.createElement('div');
//             container.className = 'toast-container';
//             document.body.appendChild(container);
//         }
//     }

//     show(message, type = 'error', duration = 3000) {
//         const container = document.querySelector('.toast-container');
//         const toast = document.createElement('div');
//         toast.className = `toast ${type}`;
//         toast.textContent = message;
//         container.appendChild(toast);

//         // Remove the toast after animation
//         setTimeout(() => {
//             toast.classList.add('hide');
//             setTimeout(() => {
//                 container.removeChild(toast);
//             }, 300); // Match animation duration
//         }, duration);
//     }
// }

// // Create a singleton instance
// const toast = new Toast();
// export default toast;