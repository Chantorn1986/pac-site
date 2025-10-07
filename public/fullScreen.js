const fullscreenButton = document.getElementById('fullscreenButton');
const fullscreenIcon = document.getElementById('fullscreenIcon');
const htmlElement = document.documentElement;

// ฟังก์ชันสำหรับบันทึกสถานะ Fullscreen ลง sessionStorage
function saveFullscreenState(is_fullscreen) {
    sessionStorage.setItem('is_fullscreen_active', is_fullscreen ? 'true' : 'false');
    console.log(`Session Fullscreen state saved: ${is_fullscreen}`);
}

// ฟังก์ชันสำหรับโหลดสถานะ Fullscreen จาก sessionStorage
function loadFullscreenState() {
    const state = sessionStorage.getItem('is_fullscreen_active');
    return state === 'true'; // คืนค่า true หรือ false
}

// ฟังก์ชันสำหรับอัปเดตไอคอนตามสถานะ Fullscreen จริง
function updateIcon() {
    if (document.fullscreenElement) {
        fullscreenIcon.classList.remove('fa-expand');
        fullscreenIcon.classList.add('fa-compress');
    } else {
        fullscreenIcon.classList.remove('fa-compress');
        fullscreenIcon.classList.add('fa-expand');
    }
}

// เมื่อกดปุ่ม Toggle Fullscreen
fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        // เข้าสู่โหมด Fullscreen
        if (htmlElement.requestFullscreen) { htmlElement.requestFullscreen(); }
        else if (htmlElement.mozRequestFullScreen) { htmlElement.mozRequestFullScreen(); }
        else if (htmlElement.webkitRequestFullscreen) { htmlElement.webkitRequestFullscreen(); }
        else if (htmlElement.msRequestFullscreen) { htmlElement.msRequestFullscreen(); }
    } else {
        // ออกจากโหมด Fullscreen
        if (document.exitFullscreen) { document.exitFullscreen(); }
        else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
        else if (document.webkitExitFullscreen) { htmlElement.webkitExitFullscreen(); } // แก้ไขตรงนี้
        else if (htmlElement.msExitFullscreen) { htmlElement.msExitFullscreen(); } // แก้ไขตรงนี้
    }
    // `fullscreenchange` event จะจัดการการบันทึกและอัปเดตไอคอน
});

// Listener สำหรับเหตุการณ์การเปลี่ยนแปลงสถานะ Fullscreen
document.addEventListener('fullscreenchange', () => {
    const isCurrentlyFullscreen = document.fullscreenElement !== null;
    console.log(`Fullscreen changed: ${isCurrentlyFullscreen}`);
    saveFullscreenState(isCurrentlyFullscreen); // บันทึกสถานะใหม่ลง sessionStorage
    updateIcon(); // อัปเดตไอคอน
});

// เมื่อหน้าเว็บโหลดครั้งแรก (หรือรีเฟรช)
document.addEventListener('DOMContentLoaded', () => {
    updateIcon(); // อัปเดตไอคอนเริ่มต้นตามสถานะ Fullscreen จริง
    
    const storedFullscreenState = loadFullscreenState();
    console.log(`Stored fullscreen state on load: ${storedFullscreenState}`);

    if (storedFullscreenState && !document.fullscreenElement) {
        console.log('SessionStorage indicates previous fullscreen. You need to re-activate.');
        // อาจแสดง UI ที่แนะนำให้ผู้ใช้กด Fullscreen อีกครั้ง
        // เช่น เปลี่ยนสีปุ่ม หรือแสดงข้อความ
    }
});

// const fullscreenButton = document.getElementById('fullscreenButton');
// const fullscreenIcon = document.getElementById('fullscreenIcon');
// const htmlElement = document.documentElement;

// // ฟังก์ชันสำหรับบันทึกสถานะ Fullscreen ลง localStorage
// function saveFullscreenState(is_fullscreen) {
//     localStorage.setItem('is_fullscreen_active', is_fullscreen ? 'true' : 'false');
//     console.log(`Fullscreen state saved: ${is_fullscreen}`);
// }

// // ฟังก์ชันสำหรับโหลดสถานะ Fullscreen จาก localStorage
// function loadFullscreenState() {
//     const state = localStorage.getItem('is_fullscreen_active');
//     return state === 'true'; // คืนค่า true หรือ false
// }

// // ฟังก์ชันสำหรับอัปเดตไอคอนตามสถานะ Fullscreen จริง
// function updateIcon() {
//     if (document.fullscreenElement) {
//         fullscreenIcon.classList.remove('fa-expand');
//         fullscreenIcon.classList.add('fa-compress');
//     } else {
//         fullscreenIcon.classList.remove('fa-compress');
//         fullscreenIcon.classList.add('fa-expand');
//     }
// }

// // เมื่อกดปุ่ม Toggle Fullscreen
// fullscreenButton.addEventListener('click', () => {
//     if (!document.fullscreenElement) {
//         // ถ้ายังไม่ได้อยู่ในโหมด Fullscreen ให้เข้าสู่โหมด Fullscreen
//         if (htmlElement.requestFullscreen) { htmlElement.requestFullscreen(); }
//         else if (htmlElement.mozRequestFullScreen) { htmlElement.mozRequestFullScreen(); }
//         else if (htmlElement.webkitRequestFullscreen) { htmlElement.webkitRequestFullscreen(); }
//         else if (htmlElement.msRequestFullscreen) { htmlElement.msRequestFullscreen(); }
//     } else {
//         // ถ้าอยู่ในโหมด Fullscreen แล้ว ให้ออกจากโหมด Fullscreen
//         if (document.exitFullscreen) { document.exitFullscreen(); }
//         else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
//         else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
//         else if (document.msExitFullscreen) { document.msExitFullscreen(); }
//     }
//     // ไม่ต้องเรียก saveFullscreenState หรือ updateIcon ตรงนี้
//     // เพราะ `fullscreenchange` event จะถูกเรียกอยู่แล้ว
// });

// // Listener สำหรับเหตุการณ์การเปลี่ยนแปลงสถานะ Fullscreen
// document.addEventListener('fullscreenchange', () => {
//     const isCurrentlyFullscreen = document.fullscreenElement !== null;
//     console.log(`Fullscreen changed: ${isCurrentlyFullscreen}`);
//     saveFullscreenState(isCurrentlyFullscreen); // บันทึกสถานะใหม่ลง localStorage
//     updateIcon(); // อัปเดตไอคอน
// });

// // เมื่อหน้าเว็บโหลดครั้งแรก (หรือรีเฟรช)
// document.addEventListener('DOMContentLoaded', () => {
//     updateIcon(); // อัปเดตไอคอนเริ่มต้นตามสถานะ Fullscreen จริง
//     // ไม่สามารถบังคับเข้า Fullscreen อัตโนมัติจาก localStorage ได้
//     // เพราะเบราว์เซอร์ไม่อนุญาตให้ `requestFullscreen()` โดยไม่มีการกดของผู้ใช้
//     // แต่เราสามารถใช้สถานะนี้เพื่อปรับแต่ง UI อื่นๆ ได้
//     const storedFullscreenState = loadFullscreenState();
//     console.log(`Stored fullscreen state on load: ${storedFullscreenState}`);

//     if (storedFullscreenState && !document.fullscreenElement) {
//         // หากต้องการแจ้งผู้ใช้ว่าเคยเปิด Fullscreen ไว้ หรือแสดง UI ที่แตกต่างออกไป
//         // alert('You were in fullscreen mode last time. Click the button to enter again!');
//         // หรืออาจจะเปลี่ยนข้อความในปุ่มชั่วคราว
//     }
// });

// // สำหรับกรณีที่ผู้ใช้กดปุ่ม Esc ออกจาก Fullscreen
// document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape' && document.fullscreenElement) {
//         // ไม่ต้องทำอะไร เพราะ fullscreenchange จะถูกเรียกโดยอัตโนมัติ
//     }
// });


// const fullscreenButton = document.getElementById('fullscreenButton');
// const iconFullscreenButton = document.getElementById('iconFullscreen');
// const htmlElement = document.documentElement; // หรือใช้ document.body หากต้องการแค่ body

// fullscreenButton.addEventListener('click', () => {
//     if (!document.fullscreenElement) {
//         // ถ้ายังไม่ได้อยู่ในโหมด Fullscreen ให้เข้าสู่โหมด Fullscreen
//         if (htmlElement.requestFullscreen) {
//             htmlElement.requestFullscreen();
//         } else if (htmlElement.mozRequestFullScreen) { /* Firefox */
//             htmlElement.mozRequestFullScreen();
//         } else if (htmlElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
//             htmlElement.webkitRequestFullscreen();
//         } else if (htmlElement.msRequestFullscreen) { /* IE/Edge */
//             htmlElement.msRequestFullscreen();
//         }
//     } else {
//         // ถ้าอยู่ในโหมด Fullscreen แล้ว ให้ออกจากโหมด Fullscreen
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.mozCancelFullScreen) { /* Firefox */
//             document.mozCancelFullScreen();
//         } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) { /* IE/Edge */
//             document.msExitFullscreen();
//         }
//     }
// });

// // Optional: เพิ่ม Listener เพื่อตรวจจับสถานะ Fullscreen
// document.addEventListener('fullscreenchange', () => {
//     if (document.fullscreenElement) {
//         console.log('Entered fullscreen mode.');
//         // fullscreenButton.textContent = 'Exit Fullscreen';
//         iconFullscreenButton.classList.remove('fa-expand');
//         iconFullscreenButton.classList.add('fa-compress');

//     } else {
//         console.log('Exited fullscreen mode.');
//         // fullscreenButton.textContent = 'Go Fullscreen';
//         iconFullscreenButton.classList.remove('fa-compress');
//         iconFullscreenButton.classList.add('fa-expand');
//     }
// });

// // สำหรับกรณีที่ผู้ใช้กดปุ่ม Esc ออกจาก Fullscreen
// document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape' && document.fullscreenElement) {
//         // ไม่ต้องทำอะไร เพราะ fullscreenchange จะถูกเรียกโดยอัตโนมัติ
//     }
// });