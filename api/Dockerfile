# Base Image
FROM python:3.9

# Install netcat
RUN apt update
RUN apt -y install netcat-traditional
RUN apt -y install python3-testresources
RUN apt clean

# set working directory
WORKDIR /usr/src/app

# add and install requirements
COPY reqs/requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# add app
COPY . /usr/src/app
EXPOSE 5000
# run server
CMD python index.py
