from matplotlib import pyplot as plt
import numpy as np

time_step=0.001
t=np.arange(0,1,time_step)
fc=50
f=5
kf=10

sig=np.sin(2*np.pi*f*t)
int_sig=np.cumsum(sig)*time_step
fm_sig=np.cos(2*np.pi*fc*t+kf*2*np.pi*int_sig)

analytic_sig=np.exp(1j*np.unwrap(np.angle(np.exp(1j*(2*np.pi*fc*t+kf*2*np.pi*int_sig)))))
phase=np.unwrap(np.angle(analytic_sig))

demod_sig=np.diff(phase)/(2*np.pi*kf*time_step)
demod_sig=np.append(demod_sig,demod_sig[-1])

plt.subplot(4,1,1)
plt.plot(t,sig)
plt.title('Original Signal')

plt.subplot(4,1,2)
plt.plot(t,fm_sig)
plt.title('FM Signal')

plt.subplot(4,1,3)
plt.plot(t,phase)
plt.title('Phase')

plt.subplot(4,1,4)
plt.plot(t,demod_sig)
plt.title('Demodulated Signal')

plt.tight_layout()
plt.show()