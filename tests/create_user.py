#!/usr/bin/env python3

import requests
import random
import json
import time
from datetime import datetime
from typing import List, Dict
import logging
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configuration du logging
logging.basicConfig(
	level=logging.INFO,
	format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class FriendGenerator:
	def __init__(self, base_url: str = "https://localhost:8443"):
		self.base_url = base_url.rstrip('/')
		self.users: List[Dict] = []
		self.main_user = None
		self.main_user_token = None
		
		self.adjectives = ['happy', 'clever', 'brave', 'swift', 'mighty', 'wise', 'calm', 'bold']
		self.nouns = ['tiger', 'eagle', 'wolf', 'bear', 'lion', 'hawk', 'fox', 'owl']
		self.bios = [
			"Passionné(e) de jeux en ligne",
			"Amateur de défis et de compétition",
			"Ici pour m'amuser et rencontrer des joueurs",
			"Toujours prêt(e) pour une partie !",
			"En quête de nouvelles aventures"
		]

	def _make_request(self, method: str, endpoint: str, **kwargs) -> requests.Response:
			"""Effectue une requête HTTP avec gestion des erreurs"""
			url = f"{self.base_url}/api{endpoint}"
			try:
					# Debug information
					logger.info(f"Making {method} request to: {url}")
					if 'json' in kwargs:
							logger.info(f"Request payload: {json.dumps(kwargs['json'], indent=2)}")
					if 'headers' in kwargs:
							logger.info(f"Request headers: {json.dumps(kwargs['headers'], indent=2)}")
							
					response = requests.request(method, url, verify=False, **kwargs)
					
					# Log response information
					logger.info(f"Response status: {response.status_code}")
					try:
							logger.info(f"Response body: {json.dumps(response.json(), indent=2)}")
					except:
							logger.info(f"Response text: {response.text}")
							
					response.raise_for_status()
					return response
			except requests.exceptions.RequestException as e:
					logger.error(f"Erreur lors de la requête {method} {endpoint}: {e}")
					if hasattr(e.response, 'text'):
							logger.error(f"Response error details: {e.response.text}")
					raise

	def create_main_user(self, username: str, password: str) -> Dict:
		"""Crée l'utilisateur principal"""
		data = {
			"username": username,
			"password": password,
			"bio": "Utilisateur principal du test"
		}
		
		try:
			# Création de l'utilisateur
			register_response = self._make_request(
				"POST",
				"/user/register",
				json=data
			)
			logger.info(f"Utilisateur principal créé: {username}")
			
			# Connexion pour obtenir le token
			login_response = self._make_request(
				"POST",
				"/user/login",
				json={"username": username, "password": password}
			)
			
			self.main_user = username
			self.main_user_token = login_response.json()['token']
			
			return {
				"username": username,
				"token": self.main_user_token,
				"detail": register_response.json().get('detail', 'Success')
			}
				
		except Exception as e:
			logger.error(f"Erreur lors de la création de l'utilisateur principal: {e}")
			raise

	def generate_unique_username(self) -> str:
		"""Génère un nom d'utilisateur unique"""
		adjective = random.choice(self.adjectives)
		noun = random.choice(self.nouns)
		number = random.randint(1, 999)
		return f"{adjective}_{noun}{number}"

	def create_friend(self) -> Dict:
		"""Crée un nouvel utilisateur et l'ajoute en ami"""
		if not self.main_user_token:
			raise Exception("L'utilisateur principal doit être créé d'abord")

		username = self.generate_unique_username()
		password = f"Pass_{random.randint(10000, 99999)}"
		bio = random.choice(self.bios)
		
		try:
			# Création du nouvel utilisateur
			register_data = {
				"username": username,
				"password": password,
				"bio": bio
			}
			self._make_request("POST", "/user/register", json=register_data)
			logger.info(f"Utilisateur créé: {username}")

			# Connexion avec le nouvel utilisateur pour obtenir son token
			login_response = self._make_request(
				"POST",
				"/user/login",
				json={"username": username, "password": password}
			)
			friend_token = login_response.json()['token']

			# Envoi de la demande d'ami depuis l'utilisateur principal
			headers = {'Authorization': f'Token {self.main_user_token}'}
			self._make_request(
				"POST",
				"/user/send_friend_request",
				headers=headers,
				json={"username": username}
			)
			logger.info(f"Demande d'ami envoyée à {username}")

			# Acceptation de la demande d'ami par le nouvel utilisateur
			headers = {'Authorization': f'Token {friend_token}'}
			self._make_request(
				"POST",
				"/user/send_friend_request",
				headers=headers,
				json={"username": self.main_user}
			)
			logger.info(f"Demande d'ami acceptée par {username}")

			# Déconnexion du compte ami
			self._make_request(
				"POST",
				"/user/logout",
				headers=headers
			)

			user_data = {
				"username": username,
				"password": password
			}
			self.users.append(user_data)
			return user_data

		except Exception as e:
			logger.error(f"Erreur lors de la création/ajout de l'ami: {e}")
			raise

	def verify_friendships(self):
		"""Vérifie le statut des amitiés créées"""
		if not self.main_user_token:
			return

		try:
			headers = {'Authorization': f'Token {self.main_user_token}'}
			response = self._make_request(
				"GET",
				f"/user/get_friends/{self.main_user}",
				headers=headers
			)
			friends = response.json()
			logger.info(f"Nombre total d'amis vérifiés: {len(friends)}")
			return friends
		except Exception as e:
			logger.error(f"Erreur lors de la vérification des amitiés: {e}")

	def generate_friends(self, main_username: str, main_password: str, n: int) -> List[Dict]:
		"""Génère le compte principal et n amis"""
		logger.info(f"Début de la création du compte principal et de {n} amis")
		
		# Création du compte principal
		self.create_main_user(main_username, main_password)
		
		# Création des amis
		for i in range(n):
			try:
				self.create_friend()
				time.sleep(0.5)  # Délai pour éviter la surcharge
				logger.info(f"Progression: {i+1}/{n}")
			except Exception as e:
				logger.error(f"Erreur lors de la génération de l'ami {i+1}: {e}")
				continue

		# Vérification finale des amitiés
		friends_list = self.verify_friendships()
		
		# Sauvegarde des données
		timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
		filename = f"friends_generated_{timestamp}.json"
		data = {
			"main_user": {
				"username": self.main_user,
				"token": self.main_user_token
			},
			"friends": self.users,
			"friends_verification": friends_list
		}
		
		with open(filename, 'w') as f:
			json.dump(data, f, indent=2)
		
		logger.info(f"Génération terminée. Données sauvegardées dans {filename}")
		return self.users

def main():
	import argparse
	parser = argparse.ArgumentParser(description="Générateur d'amis pour un utilisateur")
	parser.add_argument("username", type=str, help="Nom d'utilisateur du compte principal")
	parser.add_argument("password", type=str, help="Mot de passe du compte principal")
	parser.add_argument("nombre", type=int, help="Nombre d'amis à générer")
	parser.add_argument("--url", default="https://localhost:8443", help="URL de base de l'API")
	args = parser.parse_args()

	generator = FriendGenerator(args.url)
	generator.generate_friends(args.username, args.password, args.nombre)

if __name__ == "__main__":
	main()