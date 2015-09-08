from lightning import Lightning
from numpy import ndarray, linspace

lgn = Lightning()

nx, ny, nz = (50, 50, 50)
rgb = ndarray((nx,ny,nz,3))
hsv = ndarray((nx,ny,nz,3))
for i, ii in enumerate(linspace(0,1,nx)):
    for j, jj in enumerate(linspace(0,1,ny)):
        for k, kk in enumerate(linspace(0,1,nz)):
            position = (i, j, k)
            rgb[position] = (kk, jj, ii)
            
lgn.volume([x for x in rgb])