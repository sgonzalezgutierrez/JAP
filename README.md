## Uso de Git 📋

Para colaborar en este proyecto utilizando Git, sigue estos pasos:

1. Asegúrate de estar en la rama master (o main). Puedes cambiar a la rama master utilizando el siguiente comando:

```bash
git checkout master
o
git checkout main
```

Si ya estabas en la rama master (o main), asegúrate de tener la versión más reciente de la rama antes de realizar cambios adicionales. Para hacerlo, ejecuta el siguiente comando:

```bash
git pull
```

2. Crear una nueva rama: Antes de comenzar a trabajar en una nueva característica o arreglo de errores, crea una nueva rama para tu tarea utilizando el siguiente comando. Reemplaza nombre-rama con un nombre descriptivo para tu rama:

```bash
git checkout -b nombre-rama
```

3. Agregar cambios y confirmarlos: Realiza tus cambios en el código utilizando tu editor de código. Una vez que hayas terminado, agrega los archivos modificados al área de preparación y confirma los cambios utilizando los siguientes comandos:

```bash
git add .
```
NOTA: Si deseas agregar todos los cambios excepto uno específico, puedes usar el comando git add junto con el operador -u para agregar los cambios modificados y eliminados, seguido del nombre del archivo que deseas excluir, precedido por un guión (--). Aquí tienes cómo hacerlo:

```bash
git add -u
```

```bash
git reset -- nombre-del-archivo-a-excluir
```

Luego de agregar los archivos, se debe ejecutar el comando:

```bash
git commit -m "Mensaje descriptivo de los cambios"
```

4. Subir cambios: Una vez que hayas confirmado tus cambios en tu rama local, puedes subir la rama al repositorio remoto utilizando el siguiente comando. Reemplaza nombre-rama con el nombre de tu rama:

```bash
git push -u origin nombre-rama
```

5. Crear una solicitud de extracción (pull request): En Git, crea una solicitud de extracción para fusionar tus cambios en la rama master. Dirigirse a la interfaz web de Git y acceder a "Merge requests" para crear una solicitud de merge.
Asignar a Santiago como revisores (Reviewer).
Esto dejará una tarea al revisor/a para hacer el merge de la branch a master.

Siguiendo estos pasos, podrás colaborar en el proyecto utilizando Git de manera efectiva y organizada.